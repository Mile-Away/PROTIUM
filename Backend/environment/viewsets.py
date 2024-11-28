from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from .models import Environment, ExperimentEnv
from .serializers import EnvironmentSerializer, ExperimentEnvSerializer


class EnvironmentViewSet(ViewSet):
    queryset = Environment.objects.all()
    serializer_class = EnvironmentSerializer

    def list(self, request):
        return Response("Hello, world!", status=status.HTTP_200_OK)

    def create(self, request):
        return Response("Hello, world!", status=status.HTTP_200_OK)


class ExperimentEnvViewSet(viewsets.ViewSet):
    queryset = ExperimentEnv.objects.all()
    serializer_class = ExperimentEnvSerializer

    def list(self, request):
        return Response("Hello, world!", status=status.HTTP_200_OK)

    def create(self, request):

        print(request.data)
        # 判断 Environment 是否存在，不存在则创建
        try:
            environment = Environment.objects.get(user=request.user, is_active=True)
        except Environment.DoesNotExist:
            environment = Environment.objects.create(user=request.user, is_active=True)

        # 创建 ExperimentEnv
        experiment_env = ExperimentEnv.objects.create(
            environment=environment,
            name=request.data.get("name"),
            ip_address=request.data.get("ip_address"),
            address=request.data.get("address"),
            description=request.data.get("description") or None,
            is_active=True,
        )

        serializer = self.serializer_class(experiment_env)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
