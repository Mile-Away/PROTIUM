from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from workflow.models import Workflow
from workflow.serializer import WorkflowSerializer


class WorkflowViewSet(viewsets.ViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request):

        by_user = request.query_params.get("by_user")

        if by_user:
            workflows = Workflow.objects.filter(creator=request.user)
            serializer = WorkflowSerializer(workflows, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        workflows = Workflow.objects.all()
        serializer = WorkflowSerializer(workflows, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):

        print("Print Cookiies >>>>>>>>")
        for key, value in request.COOKIES.items():
            print(key, value)

        serializer = WorkflowSerializer(data=request.data)
        if serializer.is_valid():

            serializer.save(creator=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
