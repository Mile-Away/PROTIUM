import asyncio
import json
import os
from abc import ABC

from argo.workflows.client import ApiClient, Configuration, WorkflowServiceApi
from asgiref.sync import sync_to_async
from dflow import S3Artifact, Task
from dflow import Workflow as DFlowWorkflow
from dflow import config
from dflow.python import PythonOPTemplate
from django.conf import settings
from ops.run_vasp import RunVasp

from ..contemplates.SolverExecutor import SolverExecutor
from ..utils.handles import filter_target_handles, get_bound_handle_from_target, get_handle_data_source_content
from ..utils.nodes import get_node_header
from ..utils.utils import channel_send_node_result


def get_pod_name(node_id: str, wf_id: str, template_name: str, *, wf_name: str | None = None) -> str:
    if wf_name and wf_name == node_id:
        return wf_name

    return f"{wf_id}-{template_name}-{node_id.split('-')[-1]}"


class VaspNodeExecutor(SolverExecutor, ABC):

    @sync_to_async
    def generate_potcar(
        self,
        poscar_file,
        potcar_file="POTCAR",
        potcar_src_folder=f"{settings.LIBRARY_ROOT}/PseudoPotential/PBE/potpaw_PBE",
    ):
        try:
            with open(poscar_file, "r") as file:
                lines = file.readlines()

            # 获取元素信息
            elements = lines[5].strip().split()

            if elements is None or len(elements) == 0:
                raise Exception("未获取到元素信息，请检查 POSCAR 文件。")

            # 生成 POTCAR 文件
            with open(potcar_file, "w") as potcar:
                for element in elements:
                    potcar_src_path = os.path.join(potcar_src_folder, element, "POTCAR")
                    potcar_sv_path = os.path.join(potcar_src_folder, f"{element}_sv", "POTCAR")
                    if os.path.exists(potcar_src_path):
                        with open(potcar_src_path, "r") as src:
                            potcar.write(src.read())
                    elif os.path.exists(potcar_sv_path):
                        with open(potcar_sv_path, "r") as sv:
                            potcar.write(sv.read())
                    else:
                        raise Exception(f"无法找到 {element} 的源 POTCAR 文件：{potcar_src_path}")

            return elements

        except Exception as e:
            raise Exception(f"生成 POTCAR 文件失败：{e}")

    # async def get_default_potcar(self) -> str:
    #     return "default POTCAR"

    def get_argo_api_client(self, host=None, token=None):

        host = "https://host.docker.internal:2746"
        if token is None:
            token = config["token"]
        configuration = Configuration(host=host)
        configuration.verify_ssl = False
        if token is None:
            api_client = ApiClient(configuration)
        else:
            api_client = ApiClient(configuration, header_name="Authorization", header_value="Bearer %s" % token)
        return api_client

    async def execute(self) -> DFlowWorkflow:
        """
        poscar = get
        """

        # 从 Edge 获取 Source handle
        connected_target_handles = await filter_target_handles(self.node, connected=True)
        source_handles = [await get_bound_handle_from_target(handle) for handle in connected_target_handles]

        sources = [get_handle_data_source_content(source_handle) for source_handle in source_handles]
        sub_file_path = await asyncio.gather(*sources)

        # print(sub_file_path)

        run_vasp = Task(
            name="run-vasp",
            template=PythonOPTemplate(
                RunVasp,
                image="python:3.12",
            ),
            parameters={},
            artifacts={
                "poscar": S3Artifact(key=sub_file_path[0]),  # type: ignore
                "incar": S3Artifact(key=sub_file_path[1]),  # type: ignore
                "kpoints": S3Artifact(key=sub_file_path[2]),  # type: ignore
            },
        )

        wf = DFlowWorkflow(name=self.node_uuid)
        wf.add(run_vasp)
        wf.submit()

        api_client = self.get_argo_api_client()
        api_instance = WorkflowServiceApi(api_client)

        while True:
            await asyncio.sleep(0.1)
            # status = wf.query_status()
            res = wf.query_step("run-vasp")
            step_dict = res[0]

            try:
                status = step_dict["phase"]
                wf_id = wf.id
                template_name = step_dict["templateName"]
                node_id = step_dict["id"]
                if wf_id:
                    pod_name = get_pod_name(node_id, wf_id, template_name)
                    # print(">>>>>>>>> Pod Name", pod_name)
                else:
                    raise Exception("获取 Pod Name 失败，Workflow ID 为空")
            except Exception as e:
                raise Exception(f"获取 Pod Name 失败：{e}")

            # print(">>>>>>>>> Status", status)
            match status:
                case "Succeeded":

                    print(">>>>>>>>> Succeeded")
                    pa = f"/api/v1/workflows/argo/{wf.id}/log?logOptions.container=main&podName={pod_name}"

                    print(">>>>>>>>> Path", pa)

                    response = api_instance.api_client.call_api(
                        pa,
                        "GET",
                        # body=V1alpha1WorkflowCreateRequest(workflow=manifest),
                        response_type=object,
                        header_params=config["http_headers"],
                        _return_http_data_only=True,
                    )

                    # res = json.loads(respone)

                    # print(">>>>>>>>> Responese", respone)
                    # 将 response 按行分割，并解析每一行的 JSON 数据
                    if response and isinstance(response, str):
                        lines = response.strip().split("\n")
                        logs = []
                        messages = []

                        for line in lines:
                            try:
                                log_entry = json.loads(line)
                                print(">>>>>>>>> Log Entry", log_entry)
                                result = log_entry.get("result", {})
                                content = result.get("content", "")
                                pod_name = result.get("podName", "")

                                logs.append((result, content, pod_name))
                            except json.JSONDecodeError as e:
                                print("Failed to decode JSON line:", e)

                        # 打印解析后的日志条目
                        for result, content, pod_name in logs:
                            pass
                            # print(f"Pod Name: {pod_name}, Result: {result} Content: {content}")
                            # if "error" in content:
                            #     messages.append({"type": "error", "message": content})
                            # else:
                            #     messages.append({"type": "info", "message": content})

                        await channel_send_node_result(
                            workflow=await self.get_workflow(self.node),
                            execute_status={
                                "uuid": str(self.node.uuid),
                                "header": await get_node_header(self.node),
                                "status": "success",
                                "messages": messages,
                            },
                        )

                    break

                case "Running":
                    # 将日志返回给前端

                    pa = f"/api/v1/workflows/argo/{wf.id}/log?logOptions.container=main&podName={pod_name}"

                    # print(">>>>>>>>> Path", pa)

                    respone = api_instance.api_client.call_api(
                        pa,
                        "GET",
                        # body=V1alpha1WorkflowCreateRequest(workflow=manifest),
                        # response_type=object,
                        header_params=config["http_headers"],
                        # _return_http_data_only=True,
                    )
                    # print(">>>>>>>>> Responese", respone)

                    continue
                    # print("running")
                case "Failed":
                    raise Exception("Container Failed")
                case _:
                    continue

        return wf

        # # 创建文件夹
        # dir_path = await self.create_dir_path()

        # # 将 POSCAR, INCAR, KPOINTS 移动到文件夹
        # for sub_file in sub_file_path:
        #     if sub_file is None:
        #         raise Exception("Source file is None")
        #     await move_file(src=sub_file, dst=dir_path)

        # # 从 body 判断 POTCAR 来自于哪里
        # potcar_body_source = await self.get_body_source("potcarSelect")

        # if potcar_body_source == "default":
        #     potcar_file_path = os.path.join(dir_path, "POTCAR")
        #     element = await self.generate_potcar(os.path.join(dir_path, "POSCAR"), potcar_file=potcar_file_path)
        #     if element is None:
        #         print("generate potcar failed")
        #         raise Exception("generate potcar failed")
        # else:
        #     raise Exception("POTCAR not found")

        # Get Resource Cinfig from body
        # resource_config = await self.get_body_source("resourceConfig")

        # machine_body_source = await self.get_body_source("machineSelect")

        # if machine_body_source == "bohrium":

        #     machine_config = await self.get_body_source("config")
        #     if machine_config is None:
        #         raise Exception("Machine Config is None")
        #     await self.write(os.path.join(dir_path, "job.json"), machine_config)

        #     try:
        #         machine_config = json.loads(machine_config)  # type: ignore
        #     except json.JSONDecodeError:
        #         raise Exception("Machine Config is not a valid JSON")

        #     print(">>>>>> Start Submit Bohrium Job >>>>>>")
        #     details = await submit_bohrium_job(node=self.node, dir_path=dir_path, config=machine_config)
        #     # print(details, type(details))
        #     # {'jobGroupId': 12121871, 'jobId': 12532070, 'bohrJobId': 9983760} <class 'dict'>
        #     workflow = await self.get_workflow(self.node)

        #     await channel_send_node_result(
        #         workflow=workflow,
        #         execute_status={
        #             "uuid": str(self.node.uuid),
        #             "header": await get_node_header(self.node),
        #             "status": "success",
        #             "compile": [{"key": self.compile[0].key, "source": str(details.get("data")["jobId"])}],
        #         },
        #     )

        # return "success"


li = [
    {
        "id": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7-3738175170",
        "name": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7.run-vasp",
        "displayName": "run-vasp",
        "type": "Pod",
        "templateName": "runvasp-9vu8z",
        "templateScope": "local/3a159a94-6855-4878-82b6-2a2132392f26-p4lb7",
        "phase": "Succeeded",
        "boundaryID": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7",
        "startedAt": "2024-10-22T10:31:22Z",
        "finishedAt": "2024-10-22T10:31:25Z",
        "progress": "1/1",
        "resourcesDuration": {"cpu": 4, "memory": 2},
        "inputs": {
            "artifacts": {
                "poscar": {
                    "name": "poscar",
                    "path": "/tmp/inputs/artifacts/poscar",
                    "s3": {
                        "key": "ccaa9b74-8e9e-4c3d-8cfa-8834f2e9cb56-d6w4n/ccaa9b74-8e9e-4c3d-8cfa-8834f2e9cb56-d6w4n-writefile-9xgdh-4077345548/file"
                    },
                },
                "incar": {
                    "name": "incar",
                    "path": "/tmp/inputs/artifacts/incar",
                    "s3": {
                        "key": "90210948-9167-4725-8913-837fa633765e-njgnr/90210948-9167-4725-8913-837fa633765e-njgnr-writefile-gc1ku-1295299564/file.tgz"
                    },
                },
                "kpoints": {
                    "name": "kpoints",
                    "path": "/tmp/inputs/artifacts/kpoints",
                    "s3": {
                        "key": "b413059b-db9b-4a93-bab0-b972d35574d3-7w6b7/b413059b-db9b-4a93-bab0-b972d35574d3-7w6b7-writefile-2283r-3636415372/file"
                    },
                },
                "dflow_python_packages": {
                    "name": "dflow_python_packages",
                    "path": "/tmp/inputs/artifacts/dflow_python_packages",
                    "s3": {"key": "upload/ade34fef-3eea-4053-9e38-e49b59a0ce71/tmprf61rx60.tgz"},
                },
            }
        },
        "outputs": {
            "artifacts": {
                "main-logs": {
                    "name": "main-logs",
                    "s3": {
                        "key": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7/3a159a94-6855-4878-82b6-2a2132392f26-p4lb7-runvasp-9vu8z-3738175170/main.log"
                    },
                }
            },
            "exitCode": "0",
        },
        "hostNodeName": "minikube",
        "workflow": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7",
        "pod": None,
        "key": None,
    }
]

result_list = [
    {
        "result": {
            "content": 'time="2024-10-23T17:32:24.756Z" level=info msg="capturing logs" argo=true',
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": "poscar /tmp/inputs/artifacts/poscar/POSCAR",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": "poscar",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": "incar /tmp/inputs/artifacts/incar/tmp/INCAR",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {"result": {"content": "incar", "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421"}},
    {
        "result": {
            "content": "kpoints /tmp/inputs/artifacts/kpoints/tmp/KPOINTS",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": "kpoints",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": 'time="2024-10-23T17:32:25.765Z" level=info msg="sub-process exited" argo=true error="<nil>"',
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
]
