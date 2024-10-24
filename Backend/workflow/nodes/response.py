# li: ArgoStep = [
#     {
#         "id": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7-3738175170",
#         "name": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7.run-vasp",
#         "displayName": "run-vasp",
#         "type": "Pod",
#         "templateName": "runvasp-9vu8z",
#         "templateScope": "local/3a159a94-6855-4878-82b6-2a2132392f26-p4lb7",
#         "phase": "Succeeded",
#         "boundaryID": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7",
#         "startedAt": "2024-10-22T10:31:22Z",
#         "finishedAt": "2024-10-22T10:31:25Z",
#         "progress": "1/1",
#         "resourcesDuration": {"cpu": 4, "memory": 2},
#         "inputs": {
#             "artifacts": {
#                 "poscar": {
#                     "name": "poscar",
#                     "path": "/tmp/inputs/artifacts/poscar",
#                     "s3": {
#                         "key": "ccaa9b74-8e9e-4c3d-8cfa-8834f2e9cb56-d6w4n/ccaa9b74-8e9e-4c3d-8cfa-8834f2e9cb56-d6w4n-writefile-9xgdh-4077345548/file"
#                     },
#                 },
#                 "incar": {
#                     "name": "incar",
#                     "path": "/tmp/inputs/artifacts/incar",
#                     "s3": {
#                         "key": "90210948-9167-4725-8913-837fa633765e-njgnr/90210948-9167-4725-8913-837fa633765e-njgnr-writefile-gc1ku-1295299564/file.tgz"
#                     },
#                 },
#                 "kpoints": {
#                     "name": "kpoints",
#                     "path": "/tmp/inputs/artifacts/kpoints",
#                     "s3": {
#                         "key": "b413059b-db9b-4a93-bab0-b972d35574d3-7w6b7/b413059b-db9b-4a93-bab0-b972d35574d3-7w6b7-writefile-2283r-3636415372/file"
#                     },
#                 },
#                 "dflow_python_packages": {
#                     "name": "dflow_python_packages",
#                     "path": "/tmp/inputs/artifacts/dflow_python_packages",
#                     "s3": {"key": "upload/ade34fef-3eea-4053-9e38-e49b59a0ce71/tmprf61rx60.tgz"},
#                 },
#             }
#         },
#         "outputs": {
#             "artifacts": {
#                 "main-logs": {
#                     "name": "main-logs",
#                     "s3": {
#                         "key": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7/3a159a94-6855-4878-82b6-2a2132392f26-p4lb7-runvasp-9vu8z-3738175170/main.log"
#                     },
#                 }
#             },
#             "exitCode": "0",
#         },
#         "hostNodeName": "minikube",
#         "workflow": "3a159a94-6855-4878-82b6-2a2132392f26-p4lb7",
#         "pod": None,
#         "key": None,
#     }
# ]

# result_list: Response = [
#     {
#         "result": {
#             "content": 'time="2024-10-23T17:32:24.756Z" level=info msg="capturing logs" argo=true',
#             "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
#         }
#     },
#     {
#         "result": {
#             "content": "poscar /tmp/inputs/artifacts/poscar/POSCAR",
#             "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
#         }
#     },
#     {
#         "result": {
#             "content": "poscar",
#             "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
#         }
#     },
#     {
#         "result": {
#             "content": "incar /tmp/inputs/artifacts/incar/tmp/INCAR",
#             "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
#         }
#     },
#     {"result": {"content": "incar", "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421"}},
#     {
#         "result": {
#             "content": "kpoints /tmp/inputs/artifacts/kpoints/tmp/KPOINTS",
#             "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
#         }
#     },
#     {
#         "result": {
#             "content": "kpoints",
#             "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
#         }
#     },
#     {
#         "result": {
#             "content": 'time="2024-10-23T17:32:25.765Z" level=info msg="sub-process exited" argo=true error="<nil>"',
#             "podName": "3a159a94-6855-4878-82b6-2a2132392f26-pzfh2-runvasp-l60z8-3020312421",
#         }
#     },
# ]
