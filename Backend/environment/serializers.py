from rest_framework import serializers

from .models import (
    Environment,
    ExperimentEnv,
    CalculationEnv)


class EnvironmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Environment
        fields = "__all__"


class ExperimentEnvSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperimentEnv
        fields = "__all__"


class CalculationEnvSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculationEnv
        fields = "__all__"