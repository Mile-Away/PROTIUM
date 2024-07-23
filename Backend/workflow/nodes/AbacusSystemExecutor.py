from abc import ABC

from workflow.models import WorkflowNodeResult

from ..contemplates.IOExecutor import IOExecutor
from ..types import NodeStatus


class AbacusSystemExecutor(IOExecutor, ABC):

    async def execute(self, result: WorkflowNodeResult) -> NodeStatus:

        print("AbacusSystemExecutor >>>>>>>>", result.source)

        return "success"
