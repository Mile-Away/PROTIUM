import os
from abc import ABC
import asyncio

from ..contemplates.IOExecutor import IOExecutor


class KpointsNodeExecutor(IOExecutor, ABC):

    async def execute(self, result) -> str:

        body_source = await self.get_body_source_from_results(result, "kpoints")

        dir_path = await self.create_dir_path()

        file_path = os.path.join(dir_path, "KPOINTS")

        await asyncio.sleep(1)
        await self.write(file_path, body_source)

        result.source = file_path

        await self.save_result(result)

        return "success"
