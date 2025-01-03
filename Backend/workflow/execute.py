import asyncio

from accounts.models import User
from asgiref.sync import sync_to_async
from dflow.python import upload_packages
from workflow.models import Workflow, WorkflowNode, WorkflowNodeCompile

from .registry import NodeExecutorRegistry
from .typed import NodeStatus
from .utils.handles import check_handle_connected, filter_target_handles
from .utils.nodes import get_node_header
from .utils.utils import channel_send_node_result

upload_packages.append("ops")


class WorkflowExecuter:
    """
    获取 Nodes 中的所有 target handle 的连接信息
    如果 target handle 已连接，通过 Edges 中找到连接的 source 节点
    继续查看 source 节点是否有 target 节点，如果有，那么就继续向上查找，直到找到没有 target 节点的节点
    得到 Node 的执行顺序，然后执行 Node 的 script
    根据 node 中 result 及其中的 script 的信息，判断是否需要执行相关 script，如果需要执行，执行完成后，输出执行结束命令。
    异步执行所有可以执行的节点，等到某个 node 的 target 节点对应的所有 source 节点的都执行完毕，执行 target node，依次类推
    继续异步向上执行，直到所有的节点都执行完毕
    --------------------------------
    实施：
    整个工作流的执行器分为两步：
    1. 构建节点之间的依赖关系
    2. 依次执行节点的 script
    """

    def __init__(self, workflow_instance: Workflow, user: User | None = None):
        self.node_executor_registry = NodeExecutorRegistry()
        self.user = user
        self.workflow_instance = workflow_instance
        self.node_dependencies: dict = {}

    @sync_to_async
    def get_nodes(self):
        return list(self.workflow_instance.nodes.all())

    @sync_to_async
    def build_node_dependencies_async(self, node):
        self.build_node_dependencies(node)

    @sync_to_async
    def get_node_compile(self, node: WorkflowNode, key: str | None = None):
        return node.node_data.compile.get(key=key)

    @sync_to_async
    def get_all_compile(self, node: WorkflowNode) -> list[WorkflowNodeCompile]:
        compiles = node.node_data.compile.all()

        return list(compiles)

    async def execute_compile_script(
        self, node: WorkflowNode, compiles: list[WorkflowNodeCompile]
    ) -> list[NodeStatus]:

        scripts: list[str | None] = [item.script for item in compiles]

        if not scripts:
            return ["skipped"]

        node_executors = await asyncio.gather(
            *(
                self.node_executor_registry.get_executor(script)
                for script in scripts
                if script is not None and script != ""
            )
        )

        status = await asyncio.gather(
            *(node_executor(node).execute() for node_executor in node_executors)  # type: ignore
        )

        return status

    def build_node_dependencies(self, node: WorkflowNode):
        if node not in self.node_dependencies:
            self.node_dependencies[node] = set()

        for edge in self.workflow_instance.edges.filter(target=node):
            source = edge.source
            self.node_dependencies[node].add(source)
            self.build_node_dependencies(
                source
            )  # 这是必不可少的，为没有 target handle 的节点也在依赖中创建一个空 set()

    async def execute_node_if_no_dependencies(self, node: WorkflowNode):
        for dependent_node, dependencies in self.node_dependencies.items():
            if node in dependencies:
                dependencies.remove(node)
                if not dependencies:
                    # 如果依赖的节点都已执行完毕，则执行该节点
                    await self.execute_node(dependent_node)

    async def execute_node(self, node: WorkflowNode):
        """
        执行节点
        执行成功时，删除依赖，并执行依赖该节点，且其所有依赖都已为空的节点
        执行失败时，抛出错误，输出错误信息

        Args:
            node (WorkflowNode): The node to be executed.

        Raises:
            Exception: If an error occurs during execution.

        Returns:
            None
        """
        # NOTE: Django 在异步函数中无法直接访问关联的模型实例。在异步上下文中,访问外键时需要使用异步兼容的方法。
        # BUG: print("Executing Node >>>>>>>>", node.node_data.header)
        node_header = await get_node_header(node)
        node.status = "running"

        await channel_send_node_result(
            workflow=self.workflow_instance,
            execute_status={
                "uuid": str(node.uuid),
                "header": node_header,
                "status": node.status,
            },
        )

        try:
            # 根据 handles 执行节点的 script
            connected_target_results = await check_handle_connected(node, "target")
            connected_source_results = await check_handle_connected(node, "source")

            # 执行节点中的所有 Results，如果没有连接任意 handle，就将这个 node status 标记为跳过
            if not any(connected_target_results) and not any(connected_source_results):
                node.status = "skipped"

            # source handle 无论有没有，甚至无论有没有被连接，都有可能需要被执行
            # source handle 中任意一个被连接，或者 target handle 全部被连接，就执行 node 中的所有 results
            # TODO 这个逻辑待删除，所有情况都要允许被运行，除非被用户指定 diabeled。
            elif all(connected_target_results) or any(connected_source_results):
                # 所有的 results 都会被执行，只要有一个执行失败，就会标记为 failed
                compiles = await self.get_all_compile(node)
                # 执行这个 Node 中的所有 compile
                status = await self.execute_compile_script(node, compiles)
                # 只要有一个 failed，就返回 failed
                if "failed" in status:
                    raise Exception("Error Executing Node Compiling")
                else:
                    node.status = "success"

            # 有连接，但是 target handle 没有全部连接
            else:
                raise Exception("Error Executing Node: Not all target handles are connected")

            # 发送节点执行结果
            await channel_send_node_result(
                workflow=self.workflow_instance,
                execute_status={
                    "uuid": str(node.uuid),
                    "header": node_header,
                    "status": node.status,
                },
            )

        except Exception as e:
            # 执行失败，抛出错误并输出错误信息
            error_message = f"Error executing Node {node_header}: {str(e)}"
            node.status = "failed"
            messages = [{"type": "error", "message": error_message}]
            await channel_send_node_result(
                workflow=self.workflow_instance,
                execute_status={
                    "uuid": str(node.uuid),
                    "header": node_header,
                    "status": node.status,
                    "messages": messages,
                },
            )
            raise Exception(error_message)

        finally:
            await sync_to_async(node.save)()

            # 执行成功，删除依赖，并执行依赖该节点，且其所有依赖都已为空的节点
            await self.execute_node_if_no_dependencies(node)

            # 可以在这里添加其他的处理逻辑，如记录日志、发送通知等
            # node.status = "draft"
            return None

    async def execute(self) -> bool:
        try:
            nodes = await self.get_nodes()
            for node in nodes:
                # 如果存在 handles type 是 target 的节点，而且所有的 target handle 都已连接，构建这个节点及其所有子节点的依赖关系
                connected_results = await filter_target_handles(node, connected=True)
                if all(connected_results):
                    await self.build_node_dependencies_async(node)

            print("Node Dependencies >>>>>>>>", self.node_dependencies)

            # # 从没有依赖的节点开始执行
            # for node, dependencies in self.node_dependencies.items():
            #     if not dependencies:
            #         await self.execute_node(node)

            # 从没有依赖的节点开始执行
            no_dependency_nodes = [node for node, dependencies in self.node_dependencies.items() if not dependencies]
            await asyncio.gather(*(self.execute_node(node) for node in no_dependency_nodes))

            # 在这里获取所有的 tasks，然后 workflow.add([...steps]),
            # 这样的话每个 step ，例如对于 poscar，它的 step 名字就叫 make_poscar，我就可以从 make_poscar 这个 step 的 outputs.parameters
            # 取我需要的参数，对于 vasp 节点，定义它的步骤的时候只需要从 poscar 这个 step 的 outputs.parameters 中取出 poscar 的路径，
            # 这样的话，就是可以被定义的，然后我同时轮询所有没有依赖的节点，向前端返回状态
            # 这样的话，如果让用户定义模版，它只需要定义一个 Step 模版，但是这个模版的输入输出参数必须是固定的，比如对于，比如对于连接点是 poscar 的行为
            # 它的输入输出参数的关键词也应该是 poscar
            # 不合适，返回的 node 并非是按顺序的。

            return True

        except Exception as e:
            print(f"Workflow execution stopped due to an error: {str(e)}")
            # 可以在这里添加其他的错误处理逻辑，如记录日志、发送通知等
            return False

        finally:
            await sync_to_async(self.workflow_instance.save)()
