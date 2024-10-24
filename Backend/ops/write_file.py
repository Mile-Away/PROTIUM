from pathlib import Path

from dflow.python import OP, OPIO, Artifact, OPIOSign


class WriteFile(OP):
    def __init__(self):
        pass

    @classmethod
    def get_input_sign(cls):
        return OPIOSign(
            {
                "source": str,
                "file_name": str,
            }
        )

    @classmethod
    def get_output_sign(cls):
        return OPIOSign({"source": str, "file": Artifact(Path)})

    @OP.exec_sign_check
    def execute(
        self,
        op_in: OPIO,
    ) -> OPIO:

        source = op_in["source"]
        file_name = op_in["file_name"]

        file = Path(file_name)
        file.write_text(source)

        op_out = OPIO(
            {
                "source": source,
                "file": file,
            }
        )
        return op_out
