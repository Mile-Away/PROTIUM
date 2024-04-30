di = {
    "id": 18,
    "nodes": [
        {
            "data": {
                "handles": [
                    {
                        "node": "3812e4c1-53e2-4c70-982a-a240f3372bb4 - VASP",
                        "key": "poscar",
                        "type": "target",
                        "has_connected": False,
                        "required": False,
                        "hasConnected": True,
                    },
                    {
                        "node": "3812e4c1-53e2-4c70-982a-a240f3372bb4 - VASP",
                        "key": "potcar",
                        "type": "target",
                        "has_connected": False,
                        "required": False,
                        "hasConnected": True,
                    },
                    {
                        "node": "3812e4c1-53e2-4c70-982a-a240f3372bb4 - VASP",
                        "key": "incar",
                        "type": "target",
                        "has_connected": False,
                        "required": False,
                    },
                    {
                        "node": "3812e4c1-53e2-4c70-982a-a240f3372bb4 - VASP",
                        "key": "kpoints",
                        "type": "target",
                        "has_connected": False,
                        "required": False,
                    },
                    {
                        "node": "3812e4c1-53e2-4c70-982a-a240f3372bb4 - VASP",
                        "key": "structure",
                        "type": "source",
                        "has_connected": False,
                        "required": False,
                    },
                ],
                "body": [
                    {
                        "type": "textarea",
                        "source": "",
                        "title": None,
                        "attachment": None,
                        "node": 29,
                        "id": "7873da26-a693-45b7-a59f-da1535657ae9",
                    }
                ],
                "header": "VASP",
                "footer": "VASP 5.4.4",
            },
            "type": "solver",
            "position": {"x": 942, "y": 65},
            "positionAbsolute": {"x": 942, "y": 65},
            "width": 256,
            "height": 440,
            "dragHandle": ".drag-handle",
            "workflow": 18,
            "id": "3812e4c1-53e2-4c70-982a-a240f3372bb4",
        },
        {
            "data": {
                "handles": [
                    {
                        "node": "634e72e8-cce9-42b4-ab9c-5c8115e5e1f3 - POSCAR",
                        "key": "poscar",
                        "type": "source",
                        "has_connected": False,
                        "required": False,
                        "hasConnected": True,
                    }
                ],
                "body": [
                    {
                        "type": "textarea",
                        "source": "",
                        "title": None,
                        "attachment": None,
                        "node": 30,
                        "id": "3e8adcc4-0b5b-4feb-8cfd-c565ce527a11",
                    }
                ],
                "header": "POSCAR",
                "footer": "VASP/POSCAR",
            },
            "type": "structureInput",
            "position": {"x": 213, "y": 207},
            "positionAbsolute": {"x": 213, "y": 207},
            "width": 256,
            "height": 208,
            "dragHandle": ".drag-handle",
            "workflow": 18,
            "id": "634e72e8-cce9-42b4-ab9c-5c8115e5e1f3",
        },
        {
            "data": {
                "handles": [
                    {
                        "node": "2b885492-58fc-4f33-84c0-9031e212ef3e - POTCAR",
                        "key": "potcar",
                        "type": "source",
                        "has_connected": False,
                        "required": False,
                        "hasConnected": True,
                    }
                ],
                "body": [
                    {
                        "type": "select",
                        "source": "",
                        "title": None,
                        "attachment": None,
                        "node": 31,
                        "id": "70335288-5792-4528-987e-19b89f4d9414",
                    }
                ],
                "header": "POTCAR",
                "footer": "VASP/POTCAR",
            },
            "type": "fileSelect",
            "position": {"x": 574, "y": 227},
            "positionAbsolute": {"x": 574, "y": 227},
            "width": 256,
            "height": 358,
            "dragHandle": ".drag-handle",
            "workflow": 18,
            "id": "2b885492-58fc-4f33-84c0-9031e212ef3e",
            "selected": False,
            "dragging": False,
        },
    ],
    "edges": [
        {
            "source": "634e72e8-cce9-42b4-ab9c-5c8115e5e1f3",
            "target": "3812e4c1-53e2-4c70-982a-a240f3372bb4",
            "sourceHandle": "634e72e8-cce9-42b4-ab9c-5c8115e5e1f3-source-poscar",
            "targetHandle": "3812e4c1-53e2-4c70-982a-a240f3372bb4-target-poscar",
            "id": "reactflow__edge-634e72e8-cce9-42b4-ab9c-5c8115e5e1f3634e72e8-cce9-42b4-ab9c-5c8115e5e1f3-source-poscar-3812e4c1-53e2-4c70-982a-a240f3372bb43812e4c1-53e2-4c70-982a-a240f3372bb4-target-poscar",
        },
        {
            "source": "2b885492-58fc-4f33-84c0-9031e212ef3e",
            "target": "3812e4c1-53e2-4c70-982a-a240f3372bb4",
            "sourceHandle": "2b885492-58fc-4f33-84c0-9031e212ef3e-source-potcar",
            "targetHandle": "3812e4c1-53e2-4c70-982a-a240f3372bb4-target-potcar",
            "id": "reactflow__edge-2b885492-58fc-4f33-84c0-9031e212ef3e2b885492-58fc-4f33-84c0-9031e212ef3e-source-potcar-3812e4c1-53e2-4c70-982a-a240f3372bb43812e4c1-53e2-4c70-982a-a240f3372bb4-target-potcar",
        },
    ],
    "creator": "MileAway",
    "uuid": "97cb11e7-e058-4a84-9935-133593056bae",
    "name": "Untitled",
    "description": None,
    "created_at": "2024-04-29T16:45:17.078836+08:00",
    "updated_at": "2024-04-29T16:45:32.634178+08:00",
}
