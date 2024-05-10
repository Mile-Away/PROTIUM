import os
from abc import ABC

from workflow.models import WorkflowNode

from ..utils.IOExecutor import IOExecutor


class PoscarNodeExecutor(IOExecutor, ABC):

    def __init__(self, node: WorkflowNode):
        super().__init__(node)

    async def execute(self, result) -> str:

        body_source = await self.get_body_source(result, "poscar")

        dir_path = await self.dir_path

        file_path = os.path.join(dir_path, "POSCAR")

        await self.write(file_path, body_source)

        result.source = file_path

        return "success"
