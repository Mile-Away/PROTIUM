import asyncio
from abc import ABC

from asgiref.sync import sync_to_async
from dflow import Task, Workflow
from dflow.python import PythonOPTemplate
from ops.write_file import WriteFile

from ..contemplates.IOExecutor import IOExecutor


class PoscarNodeExecutor(IOExecutor, ABC):

    # def __init__(self, node: WorkflowNode):
    #     super().__init__(node)

    # 其实这个 execute 不是对应于 Node 的，而是对应于 Node 中的每个 Compile 的。
    async def execute(self) -> Workflow:

        # 由于 __init__ 方法中不支持异步，因此必须使用异步方法来获取数据
        content = await self.get_body_source("poscar")

        make_poscar = Task(
            name="make-poscar",
            template=PythonOPTemplate(
                WriteFile,
                image="python:3.12",
                output_artifact_archive={"file": None},
                output_artifact_global_name={"file": "POSCAR"},
            ),
            parameters={
                "source": content,
                "file_name": "POSCAR",
            },
            artifacts={},
        )

        wf = Workflow(name=self.node_uuid)
        wf.add(make_poscar)
        wf.submit()

        while True:
            await asyncio.sleep(1)
            status = wf.query_status()

            match status:
                case "Succeeded":

                    # 将输出的文件路径记录到 compile 的 source 中
                    compile = await self.get_compile("poscar")
                    outputs_s3_file_path = wf.query_step("make-poscar")[0].outputs.artifacts["file"].s3.key

                    compile.source = outputs_s3_file_path
                    await sync_to_async(compile.save)()

                    break
                case "Failed":
                    raise Exception("Container Failed")
                case _:
                    continue

        return wf


# di = [
#     {
#         "id": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2-4031889348",
#         "name": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2.make-poscar",
#         "displayName": "make-poscar",
#         "type": "Pod",
#         "templateName": "writefile-pwufh",
#         "templateScope": "local/d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2",
#         "phase": "Succeeded",
#         "boundaryID": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2",
#         "startedAt": "2024-10-18T09:24:54Z",
#         "finishedAt": "2024-10-18T09:25:00Z",
#         "progress": "1/1",
#         "resourcesDuration": {"cpu": 6, "memory": 3},
#         "inputs": {
#             "parameters": {
#                 "source": {
#                     "name": "source",
#                     "value": "Fe BCC\n1.0\n2.866 0.000 0.000\n0.000 2.866 0.000\n0.000 0.000 2.866\nFe\n2\nCartesian\n0.000 0.000 0.000\n1.433 1.433 1.433\n",
#                     "description": '{"type": "str"}',
#                 },
#                 "file_name": {"name": "file_name", "value": "/tmp/POSCAR", "description": '{"type": "str"}'},
#             },
#             "artifacts": {
#                 "dflow_python_packages": {
#                     "name": "dflow_python_packages",
#                     "path": "/tmp/inputs/artifacts/dflow_python_packages",
#                     "s3": {"key": "upload/6c7cf43d-2915-46a0-8caa-e4851df554fa/tmp3epqxx2v.tgz"},
#                 }
#             },
#         },
#         "outputs": {
#             "parameters": {
#                 "source": {
#                     "name": "source",
#                     "value": "Fe BCC\n1.0\n2.866 0.000 0.000\n0.000 2.866 0.000\n0.000 0.000 2.866\nFe\n2\nCartesian\n0.000 0.000 0.000\n1.433 1.433 1.433",
#                     "valueFrom": {"path": "/tmp/outputs/parameters/source", "default": "null"},
#                     "description": '{"type": "str"}',
#                 }
#             },
#             "artifacts": {
#                 "file": {
#                     "name": "file",
#                     "path": "/tmp/outputs/artifacts/file",
#                     "s3": {
#                         "key": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2/d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2-writefile-pwufh-4031889348/file.tgz"
#                     },
#                 },
#                 "main-logs": {
#                     "name": "main-logs",
#                     "s3": {
#                         "key": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2/d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2-writefile-pwufh-4031889348/main.log"
#                     },
#                 },
#             },
#             "exitCode": "0",
#         },
#         "hostNodeName": "minikube",
#         "workflow": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2",
#         "pod": None,
#         "key": None,
#     }
# ]
