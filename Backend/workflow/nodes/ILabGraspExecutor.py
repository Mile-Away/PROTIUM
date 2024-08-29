import asyncio
from abc import ABC

import requests
from django.conf import settings
from workflow.models import WorkflowNodeCompile

from ..contemplates.IOExecutor import IOExecutor
from ..typed import NodeStatus


class ILabGraspExecutor(IOExecutor, ABC):

    async def execute(self, compile: WorkflowNodeCompile) -> NodeStatus:

        data = {"test": "test", "action": "grasp"}

        res = requests.post(f"{settings.ILAB_HOST}/admin/v1/devices/add/", json=data)

        res.raise_for_status()

        while True:
            res = requests.get(f"{settings.ILAB_HOST}/api/v1/devices/1/status/")

            await asyncio.sleep(1)

            data = res.json().get("data")

            if data is None:
                raise Exception("ILabGraspExecutor: No Response from ILab")
            else:
                if data["status"] == "Idle":
                    break

        return "success"
