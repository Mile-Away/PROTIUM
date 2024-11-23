from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import JudgeEnvExistAPIView
from .viewsets import ExperimentEnvViewSet

router = DefaultRouter()
router.register("experiment", ExperimentEnvViewSet, basename="experiment")

urlpatterns = [
    path("vs/", include(router.urls)),
    path("judge/", JudgeEnvExistAPIView.as_view(), name="judge"),
]
