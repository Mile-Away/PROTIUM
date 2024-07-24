import asyncio
import json
import os
from abc import ABC

import aiofiles
from workflow.models import WorkflowNodeCompile
from workflow.types import NodeStatus

from ..contemplates.SolverExecutor import SolverExecutor
from ..types import BohriumJobConfigProps
from ..utils.bohrium import submit_bohrium_job
from ..utils.handles import filter_target_handles, get_bound_handle_from_target, get_handle_data_source_content
from ..utils.nodes import get_node_header
from ..utils.utils import channel_send_node_result


class AbacusSiabExecutor(SolverExecutor, ABC):

    async def read_file_content(self, file_path):
        async with aiofiles.open(file_path, mode="r") as file:
            return await file.read()

    async def execute(self, compile: WorkflowNodeCompile) -> NodeStatus:

        # 从 Edge 获取 Source handle
        connected_target_handles = await filter_target_handles(self.node, connected=True)
        source_handles = [await get_bound_handle_from_target(handle) for handle in connected_target_handles]

        # 从 Source handle 获取 Source data
        sources = [get_handle_data_source_content(source_handle) for source_handle in source_handles]
        sub_file_path = await asyncio.gather(*sources)

        body_source = await self.get_body_source("abacus_siab")

        body_source = json.loads(body_source) if body_source else {}

        siab_content = {
            os.path.splitext(os.path.basename(file_path))[0]: json.loads(await self.read_file_content(file_path))
            for file_path in sub_file_path
            if file_path and os.path.splitext(os.path.basename(file_path))[0] != "INPUT"
        }

        for file_path in sub_file_path:
            if file_path and os.path.splitext(os.path.basename(file_path))[0] == "INPUT":
                body_source.update(json.loads(await self.read_file_content(file_path)))

        siab_content.update(body_source)

        # 创建文件夹
        dir_path = await self.create_dir_path()

        # 新建 SIAB_INPUT.json 文件并将内容写入
        siab_input_path = os.path.join(dir_path, "SIAB_INPUT.json")
        await self.write(siab_input_path, json.dumps(siab_content, indent=4))

        brm_image_python = "/opt/mamba/envs/orbgen/bin/python"
        brm_image_script = "/root/deepmodeling/abacus_orbital_generation/SIAB/SIAB_nouvelle.py"
        brm_image_cmd = f"{brm_image_python} {brm_image_script} -i SIAB_INPUT.json 2>abacus_std.err"
        # TODO: Submit Task
        machine_config: BohriumJobConfigProps = {
            "project_id": 12943,
            "job_name": "abacus_siab",
            "machine_type": "c16_m32_cpu",
            "command": brm_image_cmd,
            "image_address": "registry.dp.tech/dptech/prod-16047/apns:orbgen",
        }

        details = await submit_bohrium_job(self.node, dir_path, machine_config)

        workflow = await self.get_workflow(self.node)

        await channel_send_node_result(
            workflow=workflow,
            execute_status={
                "uuid": str(self.node.uuid),
                "header": await get_node_header(self.node),
                "status": "success",
                "compile": [{"key": compile.key, "source": str(details.get("data")["jobId"])}],
            },
        )
        return "success"
