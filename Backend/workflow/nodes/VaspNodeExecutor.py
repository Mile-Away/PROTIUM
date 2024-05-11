import asyncio
from abc import ABC


from ..utils.SolverExecutor import SolverExecutor


class VaspNodeExecutor(SolverExecutor, ABC):

    async def execute(self, result) -> str:
        # 在这里编写节点的执行逻辑
        await asyncio.sleep(20)
        print(f"Executing node {self.node} with result")
        return "success"
