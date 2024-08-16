from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import NodeTemplateDetailView
router = DefaultRouter()


urlpatterns = [
    path("vs/", include(router.urls)),
    path("node/<str:name>/", NodeTemplateDetailView.as_view(), name="node_template_detail"),
]
