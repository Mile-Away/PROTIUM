from workflow.node_executors.PoscarNodeExecutor import PoscarNodeExecutor


# 对于每种节点类型,创建一个对应的执行器类或函数,并在注册表中注册。
class NodeExecutorRegistry:
    def __init__(self):
        self.executors = {}

    def register(self, node_type, executor):
        self.executors[node_type] = executor

    def get_executor(self, node_type) -> object:
        return self.executors.get(node_type)


node_executor_registry = NodeExecutorRegistry()

node_executor_registry.register("POSCAR", PoscarNodeExecutor)
