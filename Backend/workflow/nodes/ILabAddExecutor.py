from abc import ABC

from ..contemplates.ILabExecutor import ILabExecutor


class ILabAddExecutor(ILabExecutor, ABC):

    async def execute(self):

        # print(">>>>>>>>>> body", self.body)
        user_data: list = await self.get_body_source(key="ilab-add")

        # 在 user_data[0] 中添加 action 字段
        user_data[0]["action"] = "push_to"
        print(">>>>>>>>>> data", user_data[0])
        data = {"device_id": "PumpBackbone", "data": user_data[0]}

        # data = {
        #     "device_id": "PumpBackbone",
        #     "data": {
        #         "action": "PumpTransferProtocol",
        #         "from_vessel": "flask_acetone",
        #         "to_vessel": "reactor",
        #         "volume": 2000.0,
        #         "flowrate": 100.0,
        #         "viscous": False,
        #     },
        # }

        res = await self.send_request(device="Gripper", data=data)

        if res.status_code != 200:
            raise Exception(f"Error sending request to ILab: {res.text}")
        else:
            device_status = await self.poll_device_status("add")

            print(">>>>>>>>>> device_status", device_status)
