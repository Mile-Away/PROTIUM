from abc import ABC


from ..contemplates.IOExecutor import IOExecutor


class AbacusInputExecutor(IOExecutor, ABC):

    # async def execute(self, compile: WorkflowNodeCompile) -> NodeStatus:

    #     body_source = await self.get_body_source_from_compile(compile, "abacus-input")

    #     dir_path = await self.create_dir_path()

    #     file_path = os.path.join(dir_path, "INPUT")

    #     await self.write(file_path, body_source)
    #     await asyncio.sleep(20)

    #     compile.source = file_path

    #     await self.save_compile(compile)

    #     return "success"

    pass
