from typing import TypeAlias, Union

from .contemplates.IOExecutor import IOExecutor
from .contemplates.SolverExecutor import SolverExecutor
from .nodes.AbacusInputExecutor import AbacusInputExecutor
from .nodes.AbacusSiabExecutor import AbacusSiabExecutor
from .nodes.AbacusSystemExecutor import AbacusSystemExecutor
from .nodes.IncarNodeExecutor import IncarNodeExecutor
from .nodes.KpointsNodeExecutor import KpointsNodeExecutor
from .nodes.OrbitalsNodeExecutor import OribitalNodeExecutor
from .nodes.PoscarNodeExecutor import PoscarNodeExecutor
from .nodes.PotcarNodeExecutor import PotcarNodeExecutor
from .nodes.VaspNodeExecutor import VaspNodeExecutor

NodeExecutorsTypes: TypeAlias = Union[
    IOExecutor,
    SolverExecutor,
]


# 对于每种节点类型,创建一个对应的执行器类或函数,并在注册表中注册。
class NodeExecutorRegistry:
    def __init__(self):
        self.executors = {
            "poscar": PoscarNodeExecutor,
            "potcar": PotcarNodeExecutor,
            "kpoints": KpointsNodeExecutor,
            "incar": IncarNodeExecutor,
            "vasp": VaspNodeExecutor,
            "abacus_siab": AbacusSiabExecutor,
            "abacus_input": AbacusInputExecutor,
            "abacus_system": AbacusSystemExecutor,
            "orbitals": OribitalNodeExecutor,
        }

    def register(self, node_type, executor):
        self.executors[node_type] = executor

    async def get_executor(self, node_type) -> NodeExecutorsTypes | None:

        node_executor = self.executors.get(node_type)

        if node_executor is None:
            raise KeyError(f"Node type {node_type} not found in registry")

        return node_executor


# node_executor_registry = NodeExecutorRegistry()

# node_executor_registry.register("poscar", PoscarNodeExecutor)
