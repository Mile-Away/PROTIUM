import os
import shutil
import subprocess
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
                "potcar": Artifact(Path),
            }
        )

    @classmethod
    def get_output_sign(cls):
        return OPIOSign(
            {
                # "outcar": Artifact(Path),
                # "log": Artifact(Path),
                "contcar": Artifact(Path),
            }
        )

    @OP.exec_sign_check
    def execute(
        self,
        op_in: OPIO,
    ) -> OPIO:

        # 创建一个新的文件夹
        new_folder = "/tmp/vasp"  # 请替换为你希望创建的文件夹路径
        os.makedirs(new_folder, exist_ok=True)

        # 移动文件到新的文件夹
        for file_key in ["poscar", "incar", "kpoints", "potcar"]:
            src = op_in[file_key]
            if os.path.basename(src) == "CONTCAR":
                # 如果是 CONTCAR 文件，改名为 POSCAR
                dst = os.path.join(new_folder, "POSCAR")
                shutil.move(src, dst)
            else:
                dst = os.path.join(new_folder, os.path.basename(src))
                shutil.move(src, dst)

        # 切换到新的文件夹并运行命令
        os.chdir(new_folder)

        # 使用 bash -c 执行命令
        command = "source /opt/intel/oneapi/setvars.sh && mpirun -n 2 /opt/vasp.5.4.4/bin/vasp_std"
        subprocess.run(f"bash -c '{command}'", shell=True, check=True)

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
                "contcar": Path(os.path.join(new_folder, "CONTCAR")),
            }
        )
        return op_out
