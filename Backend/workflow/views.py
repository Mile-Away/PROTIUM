from django.http import Http404
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Workflow
from .serializer import WorkflowSerializer


class WorkflowDetailAPIView(APIView):

    def get_object(self, uuid: str) -> Workflow:
        """
        Retrieve a Workflow object based on the provided UUID.

        Args:
            uuid (str): The UUID of the Workflow object to retrieve.

        Returns:
            Workflow: The retrieved Workflow object.

        Raises:
            Http404: If the Workflow object with the provided UUID does not exist.
        """
        try:
            return Workflow.objects.get(uuid=uuid)
        except Workflow.DoesNotExist:
            raise Http404("Workflow does not exist")

    def get(self, request: Request, uuid: str):
        workflow = self.get_object(uuid)
        serializer = WorkflowSerializer(workflow)
        return Response(serializer.data)

    def put(self, request: Request, uuid: str) -> Response:

        # print("Request >>>>>>>>", request.data)

        workflow = self.get_object(uuid)
        serializer = WorkflowSerializer(workflow, data=request.data, partial=True)

        if serializer.is_valid():

            # print("Validated >>>>>>>>", serializer.validated_data)
            serializer.save()
            return Response(serializer.data)

        print("Errors : >>>>>>>>", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
