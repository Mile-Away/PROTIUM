import asyncio
import json
import os
from abc import ABC

from asgiref.sync import sync_to_async
from django.conf import settings
from workflow.models import WorkflowNodeCompile
from workflow.typed import NodeStatus

from ..contemplates.SolverExecutor import SolverExecutor
from ..utils.bohrium import submit_bohrium_job
from ..utils.handles import filter_target_handles, get_bound_handle_from_target, get_handle_data_source_content
from ..utils.nodes import get_node_header
from ..utils.utils import channel_send_node_result, move_file


class VaspNodeExecutor(SolverExecutor, ABC):

    @sync_to_async
    def generate_potcar(
        self,
        poscar_file,
        potcar_file="POTCAR",
        potcar_src_folder=f"{settings.LIBRARY_ROOT}/PseudoPotential/PBE/potpaw_PBE",
    ):
        try:
            with open(poscar_file, "r") as file:
                lines = file.readlines()

            # 获取元素信息
            elements = lines[5].strip().split()

            if elements is None or len(elements) == 0:
                raise Exception("未获取到元素信息，请检查 POSCAR 文件。")

            # 生成 POTCAR 文件
            with open(potcar_file, "w") as potcar:
                for element in elements:
                    potcar_src_path = os.path.join(potcar_src_folder, element, "POTCAR")
                    potcar_sv_path = os.path.join(potcar_src_folder, f"{element}_sv", "POTCAR")
                    if os.path.exists(potcar_src_path):
                        with open(potcar_src_path, "r") as src:
                            potcar.write(src.read())
                    elif os.path.exists(potcar_sv_path):
                        with open(potcar_sv_path, "r") as sv:
                            potcar.write(sv.read())
                    else:
                        raise Exception(f"无法找到 {element} 的源 POTCAR 文件：{potcar_src_path}")

            return elements

        except Exception as e:
            raise Exception(f"生成 POTCAR 文件失败：{e}")

    # async def get_default_potcar(self) -> str:
    #     return "default POTCAR"

    async def execute(self) -> NodeStatus:

        # 从 Edge 获取 Source handle
        connected_target_handles = await filter_target_handles(self.node, connected=True)
        source_handles = [await get_bound_handle_from_target(handle) for handle in connected_target_handles]

        sources = [get_handle_data_source_content(source_handle) for source_handle in source_handles]
        sub_file_path = await asyncio.gather(*sources)

        # 创建文件夹
        dir_path = await self.create_dir_path()

        # 将 POSCAR, INCAR, KPOINTS 移动到文件夹
        for sub_file in sub_file_path:
            if sub_file is None:
                return "failed"
            await move_file(src=sub_file, dst=dir_path)

        # 从 body 判断 POTCAR 来自于哪里
        potcar_body_source = await self.get_body_source("potcarSelect")

        if potcar_body_source == "default":
            potcar_file_path = os.path.join(dir_path, "POTCAR")
            element = await self.generate_potcar(os.path.join(dir_path, "POSCAR"), potcar_file=potcar_file_path)
            if element is None:
                print("generate potcar failed")
                return "failed"
        else:
            raise Exception("POTCAR not found")

        # Get Resource Cinfig from body
        # resource_config = await self.get_body_source("resourceConfig")

        machine_body_source = await self.get_body_source("machineSelect")

        if machine_body_source == "bohrium":

            machine_config = await self.get_body_source("config")
            if machine_config is None:
                return "failed"
            await self.write(os.path.join(dir_path, "job.json"), machine_config)

            try:
                machine_config = json.loads(machine_config)  # type: ignore
            except json.JSONDecodeError:
                raise Exception("Machine Config is not a valid JSON")

            print(">>>>>> Start Submit Bohrium Job >>>>>>")
            details = await submit_bohrium_job(node=self.node, dir_path=dir_path, config=machine_config)
            # print(details, type(details))
            # {'jobGroupId': 12121871, 'jobId': 12532070, 'bohrJobId': 9983760} <class 'dict'>
            workflow = await self.get_workflow(self.node)

            await channel_send_node_result(
                workflow=workflow,
                execute_status={
                    "uuid": str(self.node.uuid),
                    "header": await get_node_header(self.node),
                    "status": "success",
                    "compile": [{"key": self.compile[0].key, "source": str(details.get("data")["jobId"])}],
                },
            )

        return "success"
