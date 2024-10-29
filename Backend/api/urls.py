from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .viewsets import WorkflowApiViewSet

router_v1 = DefaultRouter()
router_v1.register("workflow", WorkflowApiViewSet, basename="workflow")

urlpatterns = [
    # path("vs/", include(router.urls)),
    # path("workflow/<uuid:uuid>/", WorkflowDetailAPIView.as_view(), name="workflow_detail"),
    path("v1/", include(router_v1.urls)),
]
