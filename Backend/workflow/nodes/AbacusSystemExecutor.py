import asyncio
import os
from abc import ABC

from workflow.models import WorkflowNodeCompile

from ..contemplates.IOExecutor import IOExecutor
from ..typed import NodeStatus


class AbacusSystemExecutor(IOExecutor, ABC):

    # async def execute(self) -> NodeStatus:

    #     body_source = await self.get_body_source_from_compile(compile, "siab-system")

    #     dir_path = await self.create_dir_path()

    #     file_path = os.path.join(dir_path, "reference_system")

    #     await self.write(file_path, body_source)
    #     await asyncio.sleep(2)
    #     compile.source = file_path

    #     await self.save_compile(compile)

    #     return "success"

    pass