from django.http import Http404
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from workflow.models import Workflow

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
