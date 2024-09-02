from django.http import Http404
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .management.commands.backup import backup_node_template_library
from .models import NodeTemplateLibrary
from .serializers import NodeTemplateLibrarySerializer


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

