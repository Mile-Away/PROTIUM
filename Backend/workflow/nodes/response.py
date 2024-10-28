
"""result_list: Response = [
    {
        "result": {
            "content": 'time="2024-10-23T17:32:24.756Z" level=info msg="capturing logs" argo=true',
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": "poscar /tmp/inputs/artifacts/poscar/POSCAR",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": "poscar",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": "incar /tmp/inputs/artifacts/incar/tmp/INCAR",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {"result": {"content": "incar", "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421"}},
    {
        "result": {
            "content": "kpoints /tmp/inputs/artifacts/kpoints/tmp/KPOINTS",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": "kpoints",
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
    {
        "result": {
            "content": 'time="2024-10-23T17:32:25.765Z" level=info msg="sub-process exited" argo=true error="<nil>"',
            "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
        }
    },
]
"""
"""ArgoStep = [
    {
        "id": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2-4031889348",
        "name": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2.make-poscar",
        "displayName": "make-poscar",
        "type": "Pod",
        "templateName": "writefile-pwufh",
        "templateScope": "local/d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2",
        "phase": "Succeeded",
        "boundaryID": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2",
        "startedAt": "2024-10-18T09:24:54Z",
        "finishedAt": "2024-10-18T09:25:00Z",
        "progress": "1/1",
        "resourcesDuration": {"cpu": 6, "memory": 3},
        "inputs": {
            "parameters": {
                "source": {
                    "name": "source",
                    "value": "Fe BCC\n1.0\n2.866 0.000 0.000\n0.000 2.866 0.000\n0.000 0.000 2.866\nFe\n2\nCartesian\n0.000 0.000 0.000\n1.433 1.433 1.433\n",
                    "description": '{"type": "str"}',
                },
                "file_name": {"name": "file_name", "value": "/tmp/POSCAR", "description": '{"type": "str"}'},
            },
            "artifacts": {
                "dflow_python_packages": {
                    "name": "dflow_python_packages",
                    "path": "/tmp/inputs/artifacts/dflow_python_packages",
                    "s3": {"key": "upload/6c7cf43d-2915-46a0-8caa-e4851df554fa/tmp3epqxx2v.tgz"},
                }
            },
        },
        "outputs": {
            "parameters": {
                "source": {
                    "name": "source",
                    "value": "Fe BCC\n1.0\n2.866 0.000 0.000\n0.000 2.866 0.000\n0.000 0.000 2.866\nFe\n2\nCartesian\n0.000 0.000 0.000\n1.433 1.433 1.433",
                    "valueFrom": {"path": "/tmp/outputs/parameters/source", "default": "null"},
                    "description": '{"type": "str"}',
                }
            },
            "artifacts": {
                "file": {
                    "name": "file",
                    "path": "/tmp/outputs/artifacts/file",
                    "s3": {
                        "key": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2/d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2-writefile-pwufh-4031889348/file.tgz"
                    },
                },
                "main-logs": {
                    "name": "main-logs",
                    "s3": {
                        "key": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2/d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2-writefile-pwufh-4031889348/main.log"
                    },
                },
            },
            "exitCode": "0",
        },
        "hostNodeName": "minikube",
        "workflow": "d7fd1b71-7eed-4c3c-924b-9a6010319214-j76n2",
        "pod": None,
        "key": None,
    }
]

"""
