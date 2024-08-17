from django.db.models import Max, Subquery
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from .models import NodeTemplateLibrary
from .serializers import NodeTemplateLibrarySerializer


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
