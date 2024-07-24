import asyncio

from asgiref.sync import sync_to_async
from workflow.models import WorkflowNode, WorkflowNodeHandle


@sync_to_async
def filter_handles(node: WorkflowNode):
    return list(node.node_data.handles.all())


@sync_to_async
def filter_target_handles(node: WorkflowNode, *, connected: bool = False):
    if connected:
        return list(node.node_data.handles.filter(type="target", hasConnected=True))
    else:
        return list(node.node_data.handles.filter(type="target"))


@sync_to_async
def get_bound_handle_from_target(handle: WorkflowNodeHandle) -> WorkflowNodeHandle:
    edge = handle.edges_targetHandle.first()
    if edge is None:
        raise Exception("No edge found")
    source_handle = edge.sourceHandle
    return source_handle


@sync_to_async
def filter_source_handles(node: WorkflowNode, connected: bool = False):
    if connected:
        return list(node.node_data.handles.filter(type="source", hasConnected=True))
    else:
        return list(node.node_data.handles.filter(type="source"))


@sync_to_async
def handle_has_connected(handle: WorkflowNodeHandle):
    return handle.hasConnected


@sync_to_async
def get_handle_data_source_content(handle: WorkflowNodeHandle) -> str | None:
    data_source = handle.data_source
    data_key = handle.data_key
    if data_source == "compile":
        source = handle.node.compile.get(key=data_key).source
        print(">>>>>>>>>>>>", source)
        return source

    elif data_source == "body":
        return handle.node.body.get(key=data_key).source
    else:
        # TODO: data_source == "handle"
        return None


async def check_handle_connected(node: WorkflowNode, source_type: str | None) -> list[bool]:
    if source_type == "target":
        target_handles = await filter_target_handles(node)
        connected_checks = [handle_has_connected(handle) for handle in target_handles]
        connected_results = await asyncio.gather(*connected_checks)
        return connected_results
    elif source_type == "source":
        source_handles = await filter_source_handles(node)
        connected_checks = [handle_has_connected(handle) for handle in source_handles]
        connected_results = await asyncio.gather(*connected_checks)
        return connected_results
    else:
        handles = await filter_handles(node)
        connected_checks = [handle_has_connected(handle) for handle in handles]
        connected_results = await asyncio.gather(*connected_checks)
        return connected_results
