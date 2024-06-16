import os
from abc import ABC
import asyncio
from workflow.models import WorkflowNodeResult

from ..contemplates.IOExecutor import IOExecutor


class PoscarNodeExecutor(IOExecutor, ABC):

    # def __init__(self, node: WorkflowNode):
    #     super().__init__(node)

    async def execute(self, result: WorkflowNodeResult) -> str:

        body_source = await self.get_body_source_from_results(result, "poscar")

        dir_path = await self.create_dir_path()

        file_path = os.path.join(dir_path, "POSCAR")

        await asyncio.sleep(3)

        await self.write(file_path, body_source)

        result.source = file_path

        await self.save_result(result)

        return "success"
