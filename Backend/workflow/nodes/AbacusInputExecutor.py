import os
from abc import ABC

from workflow.models import WorkflowNodeResult

from ..contemplates.IOExecutor import IOExecutor
from ..types import NodeStatus


class AbacusInputExecutor(IOExecutor, ABC):

    async def execute(self, result: WorkflowNodeResult) -> NodeStatus:

        body_source = await self.get_body_source_from_results(result, "abacus_input")

        dir_path = await self.create_dir_path()

        file_path = os.path.join(dir_path, "POSCAR")

        await self.write(file_path, body_source)

        result.source = file_path

        await self.save_result(result)

        return "success"
