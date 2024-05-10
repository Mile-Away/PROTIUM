import asyncio


class VaspNodeExecutor:
    def __init__(self):
        pass 

    async def execute(self, node):
        # 在这里编写节点的执行逻辑
        await asyncio.sleep(20)
        print(f"Executing node {node} with result")
