import os
from abc import ABC

from workflow.models import WorkflowNodeCompile

from ..contemplates.IOExecutor import IOExecutor
from ..typed import NodeStatus


class PoscarNodeExecutor(IOExecutor, ABC):

    # def __init__(self, node: WorkflowNode):
    #     super().__init__(node)

    async def execute(self, compile: WorkflowNodeCompile) -> NodeStatus:

        body_source = await self.get_body_source_from_compile(compile, "poscar")

        dir_path = await self.create_dir_path()

        file_path = os.path.join(dir_path, "POSCAR")

        # await asyncio.sleep(3)

        await self.write(file_path, body_source)

        compile.source = file_path

        await self.save_compile(compile)

        return "success"
