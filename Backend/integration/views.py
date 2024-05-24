from rest_framework.response import Response
from rest_framework.views import APIView

from .models import GithubRelease
from .serializers import GithubReleaseSerializer


class GithubReleaseDetail(APIView):
    queryset = GithubRelease.objects.all()
    serializer_class = GithubReleaseSerializer

    def get_object(self, name):
        return self.queryset.get(server__name=name)

    def get(self, request, name, format=None):

        release = self.get_object(name)
        serializer = self.serializer_class(release)
        return Response(serializer.data)
