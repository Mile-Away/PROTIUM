from abc import ABC

from ..contemplates.ILabExecutor import ILabExecutor


class ILabPumpTransferExecutor(ILabExecutor, ABC):

    async def execute(self):

        # print(">>>>>>>>>> body", self.body)
        user_data = self.get_body_source(key="ilab-pump-transfer")

        print(">>>>>>>>>> data", user_data)

        data = {"device_id": "PumpBackbone", "data": user_data}

        res = await self.send_request(device="add", data=data)

        if res.status_code != 200:
            raise Exception(f"Error sending request to ILab: {res.text}")
        else:
            device_status = await self.poll_device_status("add")

            print(">>>>>>>>>> device_status", device_status)
