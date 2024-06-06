from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Workflow, WorkflowEdge, WorkflowNode, WorkflowNodeBody, WorkflowNodeHandle
from .serializer import (
    WorkflowEdgeSerializer,
    WorkflowNodeBodySerializer,
    WorkflowNodeHandleSerializer,
    WorkflowNodeSerializer,
    WorkflowSerializer,
)


class WorkflowViewSet(viewsets.ViewSet):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    permission_classes = [AllowAny]

    def list(self, request):
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
