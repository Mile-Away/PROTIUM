from abc import ABC, abstractmethod

from asgiref.sync import sync_to_async
from workflow.models import WorkflowNode, WorkflowNodeResult


class NodeExecutor(ABC):

    def __init__(self, node: WorkflowNode):
        self.node = node
        self.node_uuid = str(node.uuid)

    async def get_body_source(self, result: WorkflowNodeResult, key: str) -> str:
        body = await sync_to_async(result.bodies.get)(key=key)
        return body.source

    @sync_to_async  # 必须使用 sync_to_async 装饰器，不能直接使用 async def
    def get_workflow_uuid(self, node: WorkflowNode) -> str:
        return str(node.workflow.uuid)

    @abstractmethod
    async def execute(self, result: WorkflowNodeResult) -> str:
        pass
