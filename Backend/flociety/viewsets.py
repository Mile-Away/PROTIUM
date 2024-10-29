from django.db.models import Max, Subquery
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from workflow.models import Workflow

from .models import NodeTemplateLibrary, WorkflowTemplateLibrary
from .serializers import NodeTemplateLibrarySerializer, WorkflowTemplateLibrarySerializer


class NodeTemplateLibraryViewSet(ViewSet):
    queryset = NodeTemplateLibrary.objects.all()
    serializer_class = NodeTemplateLibrarySerializer
    permission_classes = [AllowAny]

    def list(self, request):

        # 返回所有非同名的节点，有同名的只返回最新版本，即创建时间最近的版本

        # 获取每个 name 的最新 created_at 时间
        latest_versions = NodeTemplateLibrary.objects.values("name").annotate(latest_created_at=Max("created_at"))

        # 使用最新的 created_at 时间来过滤出最新版本的节点模板
        latest_node_template_libraries = NodeTemplateLibrary.objects.filter(
            created_at__in=Subquery(latest_versions.values("latest_created_at"))
        )

        serializer = NodeTemplateLibrarySerializer(latest_node_template_libraries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WorkflowTemplateLibraryViewSet(viewsets.ViewSet):

    serializer_class = WorkflowTemplateLibrarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = WorkflowTemplateLibrary.objects.all()
        return queryset

    def list(self, request):

        by_user = request.query_params.get("by_user")

        if by_user:
            workflows = self.get_queryset().filter(creator=request.user)
            serializer = self.serializer_class(workflows, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        workflows = self.get_queryset()
        serializer = self.serializer_class(workflows, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):

        print(request.data)

        workflow = Workflow.objects.get(uuid=request.data.get("workflow_uuid"))

        workflow.as_template = True
        workflow.save()
        template = WorkflowTemplateLibrary.objects.create(
            workflow=workflow,
            title=request.data.get("title"),
            description=request.data.get("description"),
        )

        serializer = self.serializer_class(template)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
