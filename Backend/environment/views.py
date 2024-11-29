from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CalculationEnv, Environment, ExperimentEnv
from .serializers import CalculationEnvSerializer, ExperimentEnvSerializer


class JudgeEnvExistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            environment = Environment.objects.get(user=user, is_active=True)
        except Environment.DoesNotExist:
            return Response({"message": "No active environment found."}, status=status.HTTP_404_NOT_FOUND)

        experiment_env = ExperimentEnv.objects.filter(environment=environment, is_active=True).first()
        calculation_env = CalculationEnv.objects.filter(environment=environment, is_active=True).first()

        data = {
            "laboratory": ExperimentEnvSerializer(experiment_env).data if experiment_env else None,
            "calculation": CalculationEnvSerializer(calculation_env).data if calculation_env else None,
        }

        # Remove keys with None values
        data = {k: v for k, v in data.items() if v is not None}

        return Response(data, status=status.HTTP_200_OK)
