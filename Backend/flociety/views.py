from uuid import uuid4 as uuidv4

from django.forms.models import model_to_dict
from django.http import Http404
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from workflow.models import (
    Workflow,
    WorkflowEdge,
    WorkflowNode,
    WorkflowNodeBody,
    WorkflowNodeCompile,
    WorkflowNodeData,
    WorkflowNodeHandle,
)

from .models import NodeTemplateLibrary, WorkflowTemplateLibrary
from .serializers import NodeTemplateLibrarySerializer, WorkflowTemplateLibrarySerializer


class NodeTemplateDetailView(APIView):

    serializer_class = NodeTemplateLibrarySerializer

    def get_object(self, name: str) -> NodeTemplateLibrary:
        """
        Retrieve a Node Template object based on the provided name.

        Args:
            name (str): The name of the Node Template object to retrieve.

        Returns:
            NodeTemplateLibrary: The Node Template object with the provided name, the most recent version.

        Raises:
            Http404: If the Workflow object with the provided UUID does not exist.
        """
        try:
            # 获取最新版本的节点模板
            node_template = NodeTemplateLibrary.objects.filter(name=name).last()
            if node_template is None:
                raise NodeTemplateLibrary.DoesNotExist
            return node_template

        except NodeTemplateLibrary.DoesNotExist:
            raise Http404("NodeTemplateLibrary does not exist")

    def get(self, request: Request, name: str):
        """
        Retrieve a Node Template object based on the provided name.

        Args:
            request (Request): The request object.
            name (str): The name of the Node Template object to retrieve.

        Returns:
            Response: The response object containing the Node Template object data.

        Raises:
            Http404: If the Workflow object with the provided UUID does not exist.
        """
        try:
            node_template = self.get_object(name)
        except NodeTemplateLibrary.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = NodeTemplateLibrarySerializer(node_template)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request: Request, uuid: str) -> Response | None:

        pass


class WorkflowTemplateDetailView(APIView):

    model = WorkflowTemplateLibrary
    serializer_class = WorkflowTemplateLibrarySerializer

    def get_object(self, uuid: str) -> WorkflowTemplateLibrary:
        """
        Retrieve a Workflow Template object based on the provided UUID.

        Args:
            uuid (str): The UUID of the Workflow object to retrieve.

        Returns:
            WorkflowTemplateLibrary: The Workflow Template object with the provided UUID.

        Raises:
            Http404: If the Workflow object with the provided UUID does not exist.
        """
        try:
            workflow = Workflow.objects.get(uuid=uuid)
            return self.model.objects.get(workflow=workflow)
        except Workflow.DoesNotExist:
            raise Http404("Workflow does not exist")
        except WorkflowTemplateLibrary.DoesNotExist:
            raise Http404("WorkflowTemplateLibrary does not exist")

    def get(self, request, uuid: str):
        """
        Retrieve a Workflow Template object based on the provided UUID.

        Args:
            request (Request): The request object.
            uuid (str): The UUID of the Workflow object to retrieve.

        Returns:
            Response: The response object containing the Workflow Template object data.

        Raises:
            Http404: If the Workflow object with the provided UUID does not exist.
        """
        try:
            instance = self.get_object(uuid)
        except Http404 as e:
            return Response({"detail": str(e)}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request: Request, uuid: str) -> Response | None:

        pass


class WorkflowTemplateForkView(APIView):

    model = WorkflowTemplateLibrary
    serializer_class = WorkflowTemplateLibrarySerializer

    def get_object(self, uuid: str) -> WorkflowTemplateLibrary:
        """
        Retrieve a Workflow Template object based on the provided UUID.

        Args:
            uuid (str): The UUID of the Workflow object to retrieve.

        Returns:
            WorkflowTemplateLibrary: The Workflow Template object with the provided UUID.

        Raises:
            Http404: If the Workflow object with the provided UUID does not exist.
        """
        try:
            workflow = Workflow.objects.get(uuid=uuid)
            return self.model.objects.get(workflow=workflow)
        except Workflow.DoesNotExist:
            raise Http404("Workflow does not exist")
        except WorkflowTemplateLibrary.DoesNotExist:
            raise Http404("WorkflowTemplateLibrary does not exist")

    def post(self, request: Request, uuid: str) -> Response | None:
        user = request.user
        new_workflow_uuid = uuidv4()
        try:
            # 获取原始 Workflow 实例
            original_workflow = Workflow.objects.get(uuid=uuid)

            # 创建新的 Workflow 实例
            new_workflow, created = Workflow.objects.update_or_create(
                uuid=new_workflow_uuid,
                creator=user,
                defaults=model_to_dict(
                    original_workflow,
                    exclude=["id", "uuid", "creator", "created_at", "updated_at", "public", "as_template"],
                ),
            )

            # 创建一个字典来存储旧节点 UUID 到新节点实例的映射
            node_mapping = {}

            for node in original_workflow.nodes.all():

                Node, created = WorkflowNode.objects.update_or_create(
                    uuid=uuidv4(),
                    workflow=new_workflow,
                    template=node.template,
                    defaults=model_to_dict(
                        node,
                        exclude=["id", "uuid", "workflow", "template"],
                    ),
                )

                node_mapping[node.uuid] = Node

                Node_Data, _ = WorkflowNodeData.objects.update_or_create(
                    node=Node,
                    defaults=model_to_dict(
                        node.node_data,
                        exclude=["id", "node"],
                    ),
                )

                for handle in node.node_data.handles.all():
                    Handle, _ = WorkflowNodeHandle.objects.update_or_create(
                        node=Node_Data,
                        key=handle.key,
                        type=handle.type,
                        defaults=model_to_dict(
                            handle,
                            exclude=["id", "node", "key", "type"],
                        ),
                    )

                for body in node.node_data.body.all():
                    Body, _ = WorkflowNodeBody.objects.update_or_create(
                        uuid=uuidv4(),
                        node=Node_Data,
                        defaults=model_to_dict(
                            body,
                            exclude=["id", "uuid", "node"],
                        ),
                    )

                for compile in node.node_data.compile.all():
                    compile_bodies = model_to_dict(compile).pop("bodies")

                    Compile, _ = WorkflowNodeCompile.objects.update_or_create(
                        uuid=uuidv4(),
                        node=Node_Data,
                        defaults=model_to_dict(
                            compile,
                            exclude=["id", "uuid", "node", "bodies"],
                        ),
                    )

                    for body_key in compile_bodies:

                        try:
                            body = WorkflowNodeBody.objects.get(node=Node_Data, key=body_key)
                            Compile.bodies.add(body)
                        except WorkflowNodeBody.DoesNotExist:
                            raise Warning("Can't find body with key: ", body_key)

            for edge in original_workflow.edges.all():
                key = edge.connection_id.split("_").pop()
                source = node_mapping[edge.source.uuid]
                target = node_mapping[edge.target.uuid]
                sourceHandle = WorkflowNodeHandle.objects.get(node=source.node_data, key=key, type="source")
                targetHandle = WorkflowNodeHandle.objects.get(node=target.node_data, key=key, type="target")

                WorkflowEdge.objects.create(
                    workflow=new_workflow,
                    source=source,
                    target=target,
                    sourceHandle=sourceHandle,
                    targetHandle=targetHandle,
                    connection_id=f"reactflow__edge-{source.uuid}_source_{key}-{target.uuid}_target_{key}",
                )

            return Response({"uuid": new_workflow_uuid}, status=status.HTTP_201_CREATED)

        except Workflow.DoesNotExist:
            return Response({"detail": "Workflow does not exist"}, status=status.HTTP_404_NOT_FOUND)
