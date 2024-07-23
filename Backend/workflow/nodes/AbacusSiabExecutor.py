from abc import ABC

from workflow.models import WorkflowNodeResult
from workflow.types import NodeStatus

from ..contemplates.SolverExecutor import SolverExecutor


class AbacusSiabExecutor(SolverExecutor, ABC):

    async def execute(self, result: WorkflowNodeResult) -> NodeStatus:

        print("AbacusSiabExecutor >>>>>>>>", result.source)

        return "success"
