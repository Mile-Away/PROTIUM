from abc import ABC


from ..contemplates.ILabExecutor import ILabExecutor
from ..typed import NodeStatus


class ILabGraspExecutor(ILabExecutor, ABC):

    async def execute(self) -> NodeStatus:

        # print(">>>>>>>>>> body", self.body)

        data = {"test": "test", "action": "grasp"}

        res = self.send_request(device="add", data=data)

        device_status = await self.poll_device_status("add")

        return "success"
