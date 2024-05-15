import subprocess

from accounts.models import User
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from workflow.models import Workflow
from workflow.types import WorkflowNodeMessageProps


@sync_to_async
def move_file(src, dst):
    result = subprocess.run(["mv", "-f", src, dst], capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"移动文件失败: {result.stderr}")
    return result.returncode


@sync_to_async
def filter_bohrium_access_token(user: User):
    return user.arithmetic_access.bohrium_access_token


async def channel_send_node_result(workflow: Workflow, execute_status: WorkflowNodeMessageProps) -> None:
    channel_layer = get_channel_layer()
    if channel_layer is not None:
        await channel_layer.group_send(
            workflow.id.to_bytes(16, byteorder="big").hex(),
            {
                "type": "node_result",
                "execute_status": execute_status,
            },
        )
    else:
        raise Exception("Channel layer is not available")
