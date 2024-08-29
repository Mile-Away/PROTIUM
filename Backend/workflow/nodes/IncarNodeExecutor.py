import os
from abc import ABC

from ..contemplates.IOExecutor import IOExecutor


class IncarNodeExecutor(IOExecutor, ABC):

    async def execute(self) -> str:

        body_source = await self.get_body_source_from_compile(self.compile[0], "incar")
        dir_path = await self.create_dir_path()

        file_path = os.path.join(dir_path, "INCAR")
        # await asyncio.sleep(10)
        await self.write(file_path, body_source)

        self.compile[0].source = file_path
        await self.save_compile(self.compile[0])
        return "success"
