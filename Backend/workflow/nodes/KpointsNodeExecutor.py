import asyncio
from abc import ABC

from asgiref.sync import sync_to_async
from dflow import Task, Workflow
from dflow.python import PythonOPTemplate
from ops.write_file import WriteFile

from ..contemplates.IOExecutor import IOExecutor


class KpointsNodeExecutor(IOExecutor, ABC):

    async def execute(self) -> Workflow:

        # 由于 __init__ 方法中不支持异步，因此必须使用异步方法来获取数据
        content = await self.get_body_source("kpoints")

        make_kpoints = Task(
            name="make-kpoints",
            template=PythonOPTemplate(
                WriteFile,
                image="python:3.12",
                output_artifact_archive={"file": None},
            ),
            parameters={
                "source": content,
                "file_name": "/tmp/KPOINTS",
            },
            artifacts={},
        )

        wf = Workflow(name=self.node_uuid)
        wf.add(make_kpoints)
        wf.submit()

        while True:
            await asyncio.sleep(1)
            status = wf.query_status()

            match status:
                case "Succeeded":

                    # 将输出的文件路径记录到 compile 的 source 中
                    compile = await self.get_compile("kpoints")
                    outputs_s3_file_path = wf.query_step("make-kpoints")[0].outputs.artifacts["file"].s3.key
                    compile.source = outputs_s3_file_path
                    await sync_to_async(compile.save)()
                    break
                case "Failed":
                    raise Exception("Container Failed")
                case _:
                    continue

        return wf
