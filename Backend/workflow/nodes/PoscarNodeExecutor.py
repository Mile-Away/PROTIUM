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
    async def execute(self) -> Task:

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

        return make_poscar
