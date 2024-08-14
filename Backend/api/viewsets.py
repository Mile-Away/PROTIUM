from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from workflow.models import Workflow

from .serializers import WorkflowApiSerializer


class WorkflowViewSet(viewsets.ViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowApiSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request):

        by_user = request.query_params.get("by_user")

        if by_user:
            workflows = Workflow.objects.filter(creator=request.user)
            serializer = self.serializer_class(workflows, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        workflows = Workflow.objects.all()
        serializer = self.serializer_class(workflows, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):

        pass
