import asyncio
from abc import ABC

from asgiref.sync import sync_to_async
from workflow.models import WorkflowNode, WorkflowNodeHandle

from .NodeExecutor import NodeExecutor


class SolverExecutor(NodeExecutor, ABC):
    @sync_to_async
    def filter_target_handles(self, node: WorkflowNode):
        return list(node.node_data.handles.filter(type="target"))

    @sync_to_async
    def filter_source_handles(self, node: WorkflowNode):
        return list(node.node_data.handles.filter(type="source"))

    @sync_to_async
    def filter_handles(self, node: WorkflowNode):
        return list(node.node_data.handles.all())

    @sync_to_async
    def handle_has_connected(self, handle: WorkflowNodeHandle):
        return handle.hasConnected

    async def check_handle_connected(self, node: WorkflowNode, source_type: str | None) -> list[bool]:
        if source_type == "target":
            target_handles = await self.filter_target_handles(node)
            connected_checks = [self.handle_has_connected(handle) for handle in target_handles]
            connected_results = await asyncio.gather(*connected_checks)
            return connected_results
        elif source_type == "source":
            source_handles = await self.filter_source_handles(node)
            connected_checks = [self.handle_has_connected(handle) for handle in source_handles]
            connected_results = await asyncio.gather(*connected_checks)
            return connected_results
        else:
            handles = await self.filter_handles(node)
            connected_checks = [self.handle_has_connected(handle) for handle in handles]
            connected_results = await asyncio.gather(*connected_checks)
            return connected_results
