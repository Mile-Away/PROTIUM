from django.http import Http404
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Workflow, WorkflowEdge, WorkflowNode, WorkflowNodeData, WorkflowNodeHandle
from .serializer import (
    WorkflowEdgeSerializer,
    WorkflowNodeDataSerializer,
    WorkflowNodeHandleSerializer,
    WorkflowNodeSerializer,
    WorkflowSerializer,
)


class WorkflowDetailAPIView(APIView):

    def get_object(self, uuid):
        try:
            return Workflow.objects.get(uuid=uuid)
        except Workflow.DoesNotExist:
            raise Http404("Workflow does not exist")

    def get(self, request, uuid, format=None):
        workflow = self.get_object(uuid)
        serializer = WorkflowSerializer(workflow)
        return Response(serializer.data)

    def put(self, request, uuid, format=None):

        # print("Request >>>>>>>>", request.data)

        workflow = self.get_object(uuid)
        serializer = WorkflowSerializer(workflow, data=request.data, partial=True)

        if serializer.is_valid():

            # print("Validated >>>>>>>>", serializer.validated_data)
            serializer.save()
            return Response(serializer.data)

        print("Errors : >>>>>>>>", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)