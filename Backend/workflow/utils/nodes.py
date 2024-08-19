from asgiref.sync import sync_to_async
from workflow.models import WorkflowNode


@sync_to_async
def get_node_header(node: WorkflowNode) -> str:
    return node.node_data.header
