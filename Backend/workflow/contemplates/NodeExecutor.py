import json
import os
from abc import ABC, abstractmethod

from accounts.models import User
from asgiref.sync import sync_to_async
from django.conf import settings
from workflow.models import Workflow, WorkflowNode, WorkflowNodeCompile

from ..utils.utils import filter_bohrium_access_token


class NodeExecutor(ABC):

    def __init__(self, node: WorkflowNode):
        self.node = node
        self.node_uuid = str(node.uuid)

    @sync_to_async
    def get_creator(self) -> User:
        return self.node.workflow.creator

    async def get_bohrium_access_key(self) -> str:
        creator = await self.get_creator()
        access_token = await filter_bohrium_access_token(creator)
        if access_token is None:
            raise ValueError("Bohrium access token is None")
        return access_token

    @sync_to_async
    def get_workflow(self, node: WorkflowNode) -> Workflow:
        return node.workflow

    @sync_to_async  # 必须使用 sync_to_async 装饰器，不能直接使用 async def
    def get_workflow_uuid(self, node: WorkflowNode) -> str:
        return str(node.workflow.uuid)

    async def get_body_source(self, key: str) -> str | None:
        body = await sync_to_async(self.node.node_data.body.get)(key=key)
        return body.source

    async def get_body_source_from_compile(self, compile: WorkflowNodeCompile, key: str) -> str:
        # 这里compile.bodies 在上传的时候就已经被指定了，要求输入 key 是因为可能有多个对应的 body，获取其中某个的 source
        body = await sync_to_async(compile.bodies.get)(key=key)
        return body.source

    async def generate_file_path(self) -> str:
        workflow_uuid = await self.get_workflow_uuid(self.node)
        return os.path.join(settings.WORKFLOW_ROOT, workflow_uuid, self.node_uuid)

    async def create_dir_path(self) -> str:
        dir_path = await self.generate_file_path()
        os.makedirs(dir_path, exist_ok=True)
        return dir_path

    async def write(self, file_path: str, content: dict | str) -> None:
        if isinstance(content, dict):
            content = json.dumps(content, ensure_ascii=False, indent=4)
        with open(file_path, "w") as f:
            f.write(content)

    async def read(self, file_path: str) -> str:
        with open(file_path, "r") as f:
            return f.read()

    async def save_compile(self, compile: WorkflowNodeCompile) -> None:
        await sync_to_async(compile.save)()

    @abstractmethod
    async def execute(self, compile: WorkflowNodeCompile) -> str:
        pass
