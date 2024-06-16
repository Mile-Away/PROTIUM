import asyncio
import os
from abc import ABC

from ..contemplates.IOExecutor import IOExecutor


class IncarNodeExecutor(IOExecutor, ABC):

    async def execute(self, result) -> str:

        body_source = await self.get_body_source_from_results(result, "incar")
        dir_path = await self.create_dir_path()

        file_path = os.path.join(dir_path, "INCAR")
        await asyncio.sleep(10)
        await self.write(file_path, body_source)

        result.source = file_path
        await self.save_result(result)
        return "success"
