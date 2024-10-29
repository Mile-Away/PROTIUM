from django.http import Http404
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .execute import WorkflowExecuter
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

    def delete(self, request: Request, uuid: str) -> Response:
        workflow = self.get_object(uuid)
        workflow.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StartWorkflowAPIView(APIView):

    def get_workflow(self, user, uuid: str) -> Workflow:
        try:
            return Workflow.objects.get(uuid=uuid, creator=user)
        except Workflow.DoesNotExist:
            raise Http404("Workflow does not exist")

    # 使用 POST 请求用来明确表达这是创建一个新资源的操作
    # 只有创建者可以运行的工作流 API
    def post(self, request: Request, uuid: str):
        user = request.user
        if not user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        workflow = self.get_workflow(user, uuid)

        print("Running Workflow >>>>>>>>", workflow)

        executer = WorkflowExecuter(workflow)
        compile = executer.execute()

        return Response({"compile": compile}, status=status.HTTP_200_OK)
