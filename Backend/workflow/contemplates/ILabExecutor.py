import asyncio
from abc import ABC
from typing import Any, Dict

import requests
from django.conf import settings

from .NodeExecutor import NodeExecutor


class ILabExecutor(NodeExecutor, ABC):

    def __init__(self, node):
        super().__init__(node)
        self.job_id = None

    # 定义向 ilab server 发送请求的方法
    async def send_request(
        self, *, url: str = f"{settings.ILAB_HOST}/api/v1/job/add", device: str, data: Dict[str, Any] | None = None
    ) -> requests.Response:
        try:
            res = requests.post(f"{url}", json=data)
            res.raise_for_status()
        except Exception as e:
            raise Exception(f"Error sending request to ILab: {e}")

        self.job_id = res.json().get("data").get("jobId")
        return res

    # 轮询设备状态
    async def poll_device_status(self, device: str):
        while True:
            res = requests.get(f"{settings.ILAB_HOST}/api/v1/devices/{self.job_id}/status/")
            await asyncio.sleep(1)
            data = res.json().get("data")
            message = res.json().get("message")
            if data is None:
                raise Exception("ILabGraspExecutor: No Response from ILab")
            elif data["status"] == "running":
                continue
            else:
                if data["status"] == "success":
                    break
                if data["status"] == "fail":
                    raise Exception(f"ILabGraspExecutor: Error from ILab: {message}")

        return data
