from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import StartWorkflowAPIView, WorkflowDetailAPIView
from .viewsets import WorkflowViewSet

router = DefaultRouter()
router.register("workflow", WorkflowViewSet, basename="workflow")

urlpatterns = [
    path("vs/", include(router.urls)),
    path("workflow/<uuid:uuid>/", WorkflowDetailAPIView.as_view(), name="workflow_detail"),
    # path("workflow/start/<uuid:uuid>/", StartWorkflowAPIView.as_view(), name="start_workflow"),
]
