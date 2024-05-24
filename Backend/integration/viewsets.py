from rest_framework import permissions, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from server.models import Server

from .models import GithubRelease, GithubServerIntergration
from .serializers import GithubReleaseSerializer


# ViewSets 是 DRF 提供的所有视图操作的抽象集合
class GithubReleaseViewSet(viewsets.ModelViewSet):
    queryset = GithubRelease.objects.all()
    serializer_class = GithubReleaseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        by_server = request.query_params.get("server")
        is_overview = request.query_params.get("overview", False)
        if is_overview:
            queryset = self.get_queryset().filter(server__server__name=by_server).order_by("-created_at")
            latest_release = queryset.first()
            name = latest_release.name
            url = latest_release.url
            published_at = latest_release.published_at
            total_count = queryset.count()
            return Response(
                {
                    "name": name,
                    "url": url,
                    "published_at": published_at,
                    "total_count": total_count,
                }
            )

        if by_server:
            queryset = self.get_queryset().filter(server__server__name=by_server).order_by("-created_at")

            serializer = self.serializer_class(queryset, many=True)
            return Response(serializer.data)

    def perform_create(self, serializer):
        if isinstance(self.request, Request) and isinstance(self.request.data, dict):

            server = Server.objects.get(name=self.request.data.get("server"))
            if server:
                github_server, _ = GithubServerIntergration.objects.get_or_create(server=server)
                serializer.save(server=github_server)
