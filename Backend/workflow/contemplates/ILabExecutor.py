import asyncio
from abc import ABC
from typing import Any, Dict

import requests
from django.conf import settings

from .NodeExecutor import NodeExecutor


class ILabExecutor(NodeExecutor, ABC):

    # 定义向 ilab server 发送请求的方法
    async def send_request(
        self, *, url: str = f"{settings.ILAB_HOST}/admin/v1/devices/", device: str, data: Dict[str, Any] | None = None
    ) -> requests.Response:
        try:
            res = requests.post(f"{url}{device}/", json=data)
            res.raise_for_status()
        except Exception as e:
            raise Exception(f"Error sending request to ILab: {e}")
        return res

    # 轮询设备状态
    async def poll_device_status(self, device: str):
        while True:
            res = requests.get(f"{settings.ILAB_HOST}/api/v1/devices/{device}/status/")
            await asyncio.sleep(1)
            data = res.json().get("data")
            if data is None:
                raise Exception("ILabGraspExecutor: No Response from ILab")
            else:
                if data["status"] == "Idle":
                    break
        
        return data