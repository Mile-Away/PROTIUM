# 对于一个 node，它的输入应该是body 中的 source，
# 函数体应该是 result 中的 script，
# 输出应该是 result 中的 source


import os
from typing import Callable
from uuid import UUID

from django.conf import settings
from workflow.models import WorkflowNode


def node_execution(node_type: str | None = None):
    """
    接受一个 node_type 返回一个装饰器函数
    """

    def decorator(func: Callable):
        def wrapper(node_uuid: UUID):
            node = WorkflowNode.objects.get(uuid=node_uuid)

            if node.type != node_type:
                raise ValueError(f"Node type must be {node_type}")

            # 获取节点的输入数据
            input_data = node.node_data.body.get(key="input").source

            # 执行节点的函数体
            result_path = func(input_data)

            # 将结果保存到节点的输出中
            node.node_data.results.create(key="output", source=result_path)

            # 更新节点状态为 "success"
            node.status = "success"
            node.save()

            return result_path

        return wrapper

    return decorator


@node_execution(node_type="POSCAR")
def execute_poscar_node(input_data: str) -> str:
    # 从输入数据中提取 POSCAR 内容
    poscar_content = input_data

    # 生成 POSCAR 文件的路径
    poscar_path = os.path.join(settings.MEDIA_ROOT, "poscar_files")

    # 将 POSCAR 内容写入文件
    with open(poscar_path, "w") as f:
        f.write(poscar_content)

    return poscar_path


