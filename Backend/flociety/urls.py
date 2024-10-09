from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import NodeTemplateDetailView, WorkflowTemplateDetailView, WorkflowTemplateForkView
from .viewsets import NodeTemplateLibraryViewSet, WorkflowTemplateLibraryViewSet

router = DefaultRouter()
router.register("nodes/library", NodeTemplateLibraryViewSet, basename="nodes")
router.register("workflows/library", WorkflowTemplateLibraryViewSet, basename="workflows")

urlpatterns = [
    path("vs/", include(router.urls)),
    path("node/<str:name>/", NodeTemplateDetailView.as_view(), name="node_template_detail"),
    path("workflow/<str:uuid>/", WorkflowTemplateDetailView.as_view(), name="workflow_template_detail"),
    path("workflow/<str:uuid>/fork/", WorkflowTemplateForkView.as_view(), name="workflow_template_fork"),
]
