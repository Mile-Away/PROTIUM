from abc import ABC

from ..contemplates.ILabExecutor import ILabExecutor


class ILabGraspExecutor(ILabExecutor, ABC):

    async def execute(self) -> None:

        # print(">>>>>>>>>> body", self.body)

        data = {"model_id": "Gripper", "data": {"position": 20, "torque": 5.0, "action": "push_to"}}

        res = await self.send_request(device="add", data=data)

        if res.status_code != 200:
            raise Exception(f"Error sending request to ILab: {res.text}")
        else:
            device_status = await self.poll_device_status("add")

            print(">>>>>>>>>> device_status", device_status)
