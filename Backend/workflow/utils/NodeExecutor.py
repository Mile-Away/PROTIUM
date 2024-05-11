import os
from abc import ABC, abstractmethod

from asgiref.sync import sync_to_async
from django.conf import settings
from workflow.models import WorkflowNode, WorkflowNodeResult


class NodeExecutor(ABC):

    def __init__(self, node: WorkflowNode):
        self.node = node
        self.node_uuid = str(node.uuid)

    @sync_to_async  # 必须使用 sync_to_async 装饰器，不能直接使用 async def
    def get_workflow_uuid(self, node: WorkflowNode) -> str:
        return str(node.workflow.uuid)

    async def get_body_source(self, key: str) -> str | None:
        body = await sync_to_async(self.node.node_data.body.get)(key=key)
        return body.source

    async def get_body_source_from_results(self, result: WorkflowNodeResult, key: str) -> str:
        body = await sync_to_async(result.bodies.get)(key=key)
        return body.source

    async def generate_file_path(self) -> str:
        workflow_uuid = await self.get_workflow_uuid(self.node)
        return os.path.join(settings.WORKFLOW_ROOT, workflow_uuid, self.node_uuid)

    async def create_dir_path(self) -> str:
        dir_path = await self.generate_file_path()
        os.makedirs(dir_path, exist_ok=True)
        return dir_path

    async def write(self, file_path: str, content: str) -> None:
        with open(file_path, "w") as f:
            f.write(content)

    async def read(self, file_path: str) -> str:
        with open(file_path, "r") as f:
            return f.read()

    async def save_result(self, result: WorkflowNodeResult) -> None:
        await sync_to_async(result.save)()

    @abstractmethod
    async def execute(self, result: WorkflowNodeResult) -> str:
        pass
