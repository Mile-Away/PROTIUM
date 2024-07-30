from abc import ABC
import os
from workflow.models import WorkflowNodeCompile

from ..contemplates.IOExecutor import IOExecutor
from ..types import NodeStatus


class OribitalNodeExecutor(IOExecutor, ABC):

    async def execute(self, compile: WorkflowNodeCompile) -> NodeStatus:

        body_source = await self.get_body_source_from_compile(compile, "siab_orbitals")

        dir_path = await self.create_dir_path()

        file_path = os.path.join(dir_path, "orbitals")

        await self.write(file_path, body_source)

        compile.source = file_path

        await self.save_compile(compile)

        return "success"
