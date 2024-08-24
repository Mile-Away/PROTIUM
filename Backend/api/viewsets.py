import uuid

from flociety.models import NodeTemplateLibrary
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from workflow.models import (
    Workflow,
    WorkflowEdge,
    WorkflowNode,
    WorkflowNodeBody,
    WorkflowNodeCompile,
    WorkflowNodeData,
    WorkflowNodeHandle,
)

from .serializers import WorkflowApiSerializer


class WorkflowViewSet(viewsets.ViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowApiSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request):

        # by_user = request.query_params.get("by_user")

        workflows = Workflow.objects.filter(creator=request.user)
        serializer = self.serializer_class(workflows, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        # 先根据 Node 中的 handles 构建连接关系 connection[]

        # ConnectionProps = {
        #     "source": "node-1",
        #     "target": "node-2",
        #     "handle": "right",
        # }

        # print(request.data)

        connections = []

        key_mapping = {}

        # Workflow Init
        workflow_name = request.data.get("name") or "untitled"
        workflow_description = request.data.get("description") or ""

        workflow_instance = Workflow.objects.create(
            name=workflow_name,
            description=workflow_description,
            creator=request.user,
        )

        workflow_nodes = request.data.get("nodes") or {}

        node_position_x = 100
        node_position_y = 100

        # Ⅰ. 创建 Node
        for key, value in workflow_nodes.items():
            # 0. 初始化 key_mapping
            if key not in key_mapping:
                key_mapping[key] = {
                    "node": None,
                    "node_data": None,
                    "handles": [],
                    "body": [],
                    "compile": [],
                    "params": value.get("params") or {},
                }

            # 1. 确定 Node 的模版
            if "version" in value and value["version"]:
                # print("Template >>>>>>>>", value.version)
                Template = NodeTemplateLibrary.objects.get(name=value["template"], version=value["version"])
            else:
                # print("Template >>>>>>>> No Version")
                Template = NodeTemplateLibrary.objects.filter(name=value["template"]).latest("version")

            # print("Template >>>>>>>>", Template)

            # 2. 创建 Node
            node_dict = {"uuid": uuid.uuid4(), "workflow": workflow_instance, "template": Template}

            # 生成有序位置
            node_dict["position"] = {"x": node_position_x, "y": node_position_y}

            node_position_x += 50
            node_position_y += 15

            Node = WorkflowNode.objects.create(
                uuid=node_dict["uuid"],
                workflow=node_dict["workflow"],
                template=node_dict["template"],
                position=node_dict["position"],
            )

            key_mapping[key]["node"] = Node

            # print("Node >>>>>>>>", Node)

            # 3. 创建 Node Data
            node_data_dict = {"node": Node, "header": Template.node_data.header, "footer": Template.node_data.footer}

            Node_Data = WorkflowNodeData.objects.create(
                node=Node, header=node_data_dict["header"], footer=node_data_dict["footer"]
            )

            key_mapping[key]["node_data"] = Node_Data

            # 4. 这一步是先把所有 handle 加上去，无论有没有连接，先不考虑连接的逻辑
            for handle in Template.node_data.handles.all():
                node_handles_dict = {
                    "node": Node_Data,
                    "key": handle.key,
                    "type": handle.type,
                }

                Node_Handle = WorkflowNodeHandle.objects.create(
                    node=node_handles_dict["node"], key=node_handles_dict["key"], type=node_handles_dict["type"]
                )

                key_mapping[key]["handles"].append(Node_Handle)

            # 5. Create Node Body
            for body in Template.node_data.body.all():
                node_body_dict = {
                    "uuid": uuid.uuid4(),
                    "node": Node_Data,
                    "key": body.key,
                    "type": body.type,
                    "title": body.title,
                }

                # 从 key_mapping.params 中找到对应的参数
                node_body_dict["source"] = key_mapping[key]["params"].get(node_body_dict["key"]) or {}

                # print(f"Node Body {node_body_dict['key']} has no source")

                # 实例化 Node Body，并且将上传的参数传递给 source
                Node_Body = WorkflowNodeBody.objects.create(
                    uuid=node_body_dict["uuid"],
                    node=node_body_dict["node"],
                    key=node_body_dict["key"],
                    type=node_body_dict["type"],
                    title=node_body_dict["title"],
                    source=node_body_dict["source"],
                )

                key_mapping[key]["body"].append(Node_Body)

            # 6. Create Node Compile
            for compile in Template.node_data.compile.all():
                node_compile_dict = {
                    "uuid": uuid.uuid4(),
                    "node": Node_Data,
                    "key": compile.key,
                    "type": compile.type,
                    "script": compile.script,
                }

                Node_Compile = WorkflowNodeCompile.objects.create(
                    uuid=node_compile_dict["uuid"],
                    node=node_compile_dict["node"],
                    key=node_compile_dict["key"],
                    type=node_compile_dict["type"],
                    script=node_compile_dict["script"],
                )

                key_mapping[key]["compile"].append(Node_Compile)

            # print("Key Mapping >>>>>>>>", key_mapping)

        # Ⅱ. 构建连接关系
        for key, value in workflow_nodes.items():
            if "handles" in value and value["handles"]:
                for handle_key, handle_value in value["handles"].items():
                    # print("Handle Key >>>>>>>>", handle_key)
                    # print("Handle Value >>>>>>>>", handle_value)
                    for i in handle_value:
                        # print("Handle Value >>>>>>>>", i)
                        try:
                            workflow_nodes.get(i)
                        except KeyError:
                            raise Exception("Node not found")
                        connections.append({"source": i, "target": key, "handle": handle_key})

            # print("Connection >>>>>>>>", connections)

        # Ⅲ. 创建连接
        for connection in connections:
            source = connection["source"]
            target = connection["target"]
            handle = connection["handle"]

            # Find the source handle
            source_handle: WorkflowNodeHandle | None = next(
                (h for h in key_mapping[source]["handles"] if h.key == handle), None
            )
            # Find the target handle
            target_handle: WorkflowNodeHandle | None = next(
                (h for h in key_mapping[target]["handles"] if h.key == handle), None
            )

            if source_handle and target_handle:
                source_handle.hasConnected = True
                source_handle.save()

                target_handle.hasConnected = True
                target_handle.save()

                # Create the edge
                WorkflowEdge.objects.create(
                    workflow=workflow_instance,
                    connection_id=f"reactflow__edge-{source_handle}-{target_handle}",
                    source=key_mapping[source]["node"],
                    target=key_mapping[target]["node"],
                    sourceHandle=source_handle,
                    targetHandle=target_handle,
                )

        serializer = self.serializer_class(workflow_instance, context={"request": request})

        return Response(data=serializer.data, status=status.HTTP_201_CREATED)
