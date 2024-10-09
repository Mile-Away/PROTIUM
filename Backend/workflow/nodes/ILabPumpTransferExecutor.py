from abc import ABC

from ..contemplates.ILabExecutor import ILabExecutor
from ..typed import NodeStatus


class ILabPumpTransferExecutor(ILabExecutor, ABC):

    async def execute(self) -> NodeStatus:

        # print(">>>>>>>>>> body", self.body)

        data = {
            "device_id": "PumpBackbone",
            "data": {
                "action": "PumpTransferProtocol",
                "from_vessel": "flask_acetone",
                "to_vessel": "reactor",
                "volume": 2000.0,
                "flowrate": 100.0,
                "viscous": False,
            },
        }

        res = await self.send_request(device="add", data=data)

        if res.status_code != 200:
            raise Exception(f"Error sending request to ILab: {res.text}")
        else:
            device_status = await self.poll_device_status("add")

        return "success"
