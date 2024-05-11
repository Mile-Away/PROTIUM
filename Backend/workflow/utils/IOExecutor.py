import os
from abc import ABC

from django.conf import settings

from .NodeExecutor import NodeExecutor


class IOExecutor(NodeExecutor, ABC):

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
