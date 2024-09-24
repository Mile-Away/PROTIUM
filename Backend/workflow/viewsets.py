from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Workflow
from .serializer import WorkflowSerializer


class WorkflowViewSet(viewsets.ViewSet):

    serializer_class = WorkflowSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Workflow.objects.filter(as_template=False)
        return queryset

    def list(self, request):

        by_user = request.query_params.get("by_user")

        if by_user:
            workflows = self.get_queryset().filter(creator=request.user)
            serializer = WorkflowSerializer(workflows, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        workflows = self.get_queryset()
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



