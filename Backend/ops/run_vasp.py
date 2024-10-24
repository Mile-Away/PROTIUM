from pathlib import Path

from dflow.python import OP, OPIO, Artifact, OPIOSign


class RunVasp(OP):
    def __init__(self):
        pass

    @classmethod
    def get_input_sign(cls):
        return OPIOSign(
            {
                "poscar": Artifact(Path),
                "incar": Artifact(Path),
                "kpoints": Artifact(Path),
            }
        )

    @classmethod
    def get_output_sign(cls):
        return OPIOSign(
            {
                # "outcar": Artifact(Path),
                # "log": Artifact(Path),
            }
        )

    @OP.exec_sign_check
    def execute(
        self,
        op_in: OPIO,
    ) -> OPIO:

        with open(op_in["poscar"], "r") as file:
            print("poscar", op_in["poscar"])
            content = file.read()

        print(content)

        with open(op_in["incar"], "r") as file:
            print("incar", op_in["incar"])
            content = file.read()

        print(content)

        with open(op_in["kpoints"], "r") as file:
            print("kpoints", op_in["kpoints"])
            content = file.read()

        print(content)

        # with open(sub_file_path, "r") as f:
        #     content = f.read()

        # print(content)

        # task_subdir = op_in["task_subdir"]
        # poscar = op_in["poscar"]
        # potcar = op_in["potcar"]
        # # make subdir
        # task_subdir = Path(task_subdir)
        # task_subdir.mkdir()
        # # change to task dir
        # cwd = os.getcwd()
        # os.chdir(task_subdir)
        # # link poscar and potcar
        # if not Path("POSCAR").exists():
        #     Path("POSCAR").symlink_to(poscar)
        # if not Path("POTCAR").exists():
        #     Path("POTCAR").symlink_to(potcar)
        # # write output, assume POSCAR, POTCAR, OUTCAR are in the same dir
        # # (task_subdir)
        # ofile = Path("OUTCAR")
        # ofile.write_text("\n".join([Path("POSCAR").read_text(), Path("POTCAR").read_text()]))
        # # write log
        # logfile = Path("log")
        # logfile.write_text("\n".join(["this is log", Path("POSCAR").read_text(), Path("POTCAR").read_text()]))
        # # chdir
        # os.chdir(cwd)
        # output of the OP
        op_out = OPIO(
            {
                # "outcar": task_subdir / ofile,
                # "log": task_subdir / logfile,
            }
        )
        return op_out
