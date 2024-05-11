import asyncio
import os
from abc import ABC

from ..utils.SolverExecutor import SolverExecutor


class VaspNodeExecutor(SolverExecutor, ABC):

    async def get_default_potcar(self):
        return "default POTCAR"

    async def execute(self, result) -> str:

        # 从 target handle 获取 POSCAR, INCAR, KPOINTS 的文件路径
        if not await self.check_handle_connected(self.node, "target"):
            return "failed"
        
        # target_handles = await self.filter_target_handles(self.node)

        # 从 body 判断 POTCAR 来自于哪里
        body_source = await self.get_body_source("potcarSelect")

        if body_source == "default":
            potcar_content = await self.get_default_potcar()
            potcat_dir_path = await self.create_dir_path()

            potcar_file_path = os.path.join(potcat_dir_path, "POTCAR")
            await self.write(potcar_file_path, potcar_content)

        else:
            raise Exception("POTCAR not found")

        await asyncio.sleep(20)

        return "success"
