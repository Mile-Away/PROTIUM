import asyncio
from abc import ABC
from typing import Any, Dict

import requests
from django.conf import settings
from environment.models import Environment, ExperimentEnv
from workflow.models import WorkflowNode

from .NodeExecutor import NodeExecutor


class ILabExecutor(NodeExecutor, ABC):

    def __init__(self, node: WorkflowNode):
        super().__init__(node)
        self.job_id = None
        self.creator = node.workflow.creator

    # 定义向 ilab server 发送请求的方法
    async def send_request(
        self, *, url: str = "/api/v1/job/add", device: str, data: Dict[str, Any] | None = None
    ) -> requests.Response:
        try:
            full_url = self.get_laboratory_host() + url
            res = requests.post(f"{full_url}", json=data)

            print(">>>>>>>>>> res", res.json())

            res.raise_for_status()
        except Exception as e:
            raise Exception(f"Error sending request to ILab: {e}")

        self.job_id = res.json().get("data").get("jobId")
        return res

    # 轮询设备状态
    async def poll_device_status(self, device: str):
        while True:
            res = requests.get(f"{settings.ILAB_HOST}/api/v1/job/{self.job_id}/status/")
            await asyncio.sleep(1)
            data = res.json().get("data")
            message = res.json().get("message")

            if data is None:
                raise Exception("ILabExecutor: No Response from ILab")

            elif data["status"] == "running":
                continue
            else:
                if data["status"] == "success":
                    break
                if data["status"] == "fail":
                    raise Exception(f"ILabGraspExecutor: Error from ILab: {message}")

        return data

    def get_laboratory_host(self):
        environ = Environment.objects.get(user=self.creator, is_active=True)
        experiment_env = ExperimentEnv.objects.get(environment=environ, is_active=True)

        ip_address = experiment_env.ip_address
        return ip_address
