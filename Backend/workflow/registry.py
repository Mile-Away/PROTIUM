from workflow.nodes.IncarNodeExecutor import IncarNodeExecutor
from workflow.nodes.KpointsNodeExecutor import KpointsNodeExecutor
from workflow.nodes.PoscarNodeExecutor import PoscarNodeExecutor
from workflow.nodes.PotcarNodeExecutor import PotcarNodeExecutor


# 对于每种节点类型,创建一个对应的执行器类或函数,并在注册表中注册。
class NodeExecutorRegistry:
    def __init__(self):
        self.executors = {
            "poscar": PoscarNodeExecutor,
            "potcar": PotcarNodeExecutor,
            "kpoints": KpointsNodeExecutor,
            "incar": IncarNodeExecutor,
        }

    def register(self, node_type, executor):
        self.executors[node_type] = executor

    async def get_executor(self, node_type):
        return self.executors.get(node_type)


node_executor_registry = NodeExecutorRegistry()

# node_executor_registry.register("poscar", PoscarNodeExecutor)
