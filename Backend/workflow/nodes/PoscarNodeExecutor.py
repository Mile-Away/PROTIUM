import asyncio
from abc import ABC
from pathlib import Path

from dflow import Step, Workflow, config
from dflow.python import OP, OPIO, Artifact, OPIOSign, PythonOPTemplate

from ..contemplates.IOExecutor import IOExecutor


class WriteFile(OP):
    def __init__(self):
        pass

    @classmethod
    def get_input_sign(cls):
        return OPIOSign(
            {
                "msg": str,
            }
        )

    @classmethod
    def get_output_sign(cls):
        return OPIOSign(
            {
                "out_art": Artifact(Path),
                "length": int,
            }
        )

    @OP.exec_sign_check
    def execute(
        self,
        op_in: OPIO,
    ) -> OPIO:
        with open("msg.txt", "w") as f:
            f.write(op_in["msg"])

        op_out = OPIO(
            {
                "out_art": Path("msg.txt"),
                "length": len(op_in["msg"]),
            }
        )
        return op_out


class PoscarNodeExecutor(IOExecutor, ABC):

    # def __init__(self, node: WorkflowNode):
    #     super().__init__(node)

    async def execute(self) -> Step:

        #     body_source = await self.get_body_source_from_compile(compile, "poscar")

        #     dir_path = await self.create_dir_path()

        #     file_path = os.path.join(dir_path, "POSCAR")

        #     # await asyncio.sleep(3)

        #     await self.write(file_path, body_source)

        #     compile.source = file_path

        #     await self.save_compile(compile)

        #     return "success"

        await asyncio.sleep(3)

        step = Step(
            name="poscar",
            template=PythonOPTemplate(WriteFile, image="python:3.12"),
            parameters={"msg": "HelloWorld!"},
        )

        wf = Workflow(name="poscar")

        wf.add(step)
        wf.submit()

        return step
