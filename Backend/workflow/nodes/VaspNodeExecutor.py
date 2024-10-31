import asyncio
import json
import os
from abc import ABC

from argo.workflows.client import ApiClient, Configuration, WorkflowServiceApi
from asgiref.sync import sync_to_async
from dflow import S3Artifact, Task
from dflow import Workflow as DFlowWorkflow
from dflow import config, upload_artifact
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


def extract_result(response: str) -> str:
    lines = response.strip().split("\n")
    logs = []
    messages = []

    for line in lines:
        try:
            log_entry = json.loads(line)
            result = log_entry.get("result", {})
            content = result.get("content", "")
            pod_name = result.get("podName", "")
            # 如果 content 字符串中有 level = info，则不添加到 messages 中
            if "level=info" in content:
                continue
            else:
                logs.append((result, content, pod_name))
        except json.JSONDecodeError as e:
            print("Failed to decode JSON line:", e)

    for result, content, pod_name in logs:
        messages.append({"type": "info", "message": content})

    # 把列表转化成带 \n 的字符串
    return "\n".join([message["message"] for message in messages])


def get_argo_api_client(host=None, token=None):

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

    async def execute(self) -> Task:
        """
        poscar
        """

        # 从 Edge 获取 Source handle
        connected_target_handles = await filter_target_handles(self.node, connected=True)
        source_handles = [await get_bound_handle_from_target(handle) for handle in connected_target_handles]

        sources = [get_handle_data_source_content(source_handle) for source_handle in source_handles]
        sub_file_path = await asyncio.gather(*sources)

        potcar = upload_artifact(["/app/ops/POTCAR"])

        run_vasp = Task(
            name="run-vasp",
            template=PythonOPTemplate(
                RunVasp,
                image="mileaway/sci-calc:5.4.4",
            ),
            parameters={},
            artifacts={
                "poscar": S3Artifact(key=sub_file_path[0]),  # type: ignore
                "incar": S3Artifact(key=sub_file_path[1]),  # type: ignore
                "kpoints": S3Artifact(key=sub_file_path[2]),  # type: ignore
                "potcar": potcar,
            },
        )

        # run_vasp.inputs.poscar = make_poscar/cif2poscar.outputs.poscar

        wf = DFlowWorkflow(name=self.node_uuid)
        wf.add(run_vasp)
        wf.submit()

        api_client = get_argo_api_client()
        api_instance = WorkflowServiceApi(api_client)

        while True:
            await asyncio.sleep(1)
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

                    await channel_send_node_result(
                        workflow=await self.get_workflow(self.node),
                        execute_status={
                            "uuid": str(self.node.uuid),
                            "header": await get_node_header(self.node),
                            "status": "success",
                        },
                    )

                    compile = await self.get_compile("contcar")
                    outputs_s3_file_path = step_dict["outputs"]["artifacts"]["contcar"]["s3"]["key"]

                    compile.source = outputs_s3_file_path
                    await sync_to_async(compile.save)()
                    break

                case "Running":
                    # 将日志返回给前端
                    pa = f"/api/v1/workflows/argo/{wf.id}/log?logOptions.container=main&podName={pod_name}"

                    response = api_instance.api_client.call_api(
                        pa,
                        "GET",
                        # body=V1alpha1WorkflowCreateRequest(workflow=manifest),
                        response_type=object,
                        header_params=config["http_headers"],
                        _return_http_data_only=True,
                    )

                    # 将 response 按行分割，并解析每一行的 JSON 数据
                    if response and isinstance(response, str):
                        lines = response.strip().split("\n")
                        logs = []
                        messages = []

                        for line in lines:
                            try:
                                log_entry = json.loads(line)
                                result = log_entry.get("result", {})
                                content = result.get("content", "")
                                pod_name = result.get("podName", "")

                                logs.append((result, content, pod_name))
                            except json.JSONDecodeError as e:
                                print("Failed to decode JSON line:", e)

                        # 打印解析后的日志条目
                        for result, content, pod_name in logs:

                            messages.append({"type": "info", "message": content})

                        comp = await self.get_compile("logs")

                        source = extract_result(response)

                        comp.source = source
                        await sync_to_async(comp.save)()

                        await channel_send_node_result(
                            workflow=await self.get_workflow(self.node),
                            execute_status={
                                "uuid": str(self.node.uuid),
                                "header": await get_node_header(self.node),
                                "status": "running",
                                "compile": [{"key": "logs", "source": source}],
                            },
                        )

                    continue

                case "Failed":
                    raise Exception("Container Failed")
                case _:
                    continue

        return run_vasp

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
