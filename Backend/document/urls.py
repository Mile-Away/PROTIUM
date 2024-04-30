from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AttachmentDetailView,
    AttachmentViewset,
    DocumentActivityView,
    DocumentDetailView,
    DocumentListViewSet,
    PublicArticleDetailView,
)

router = DefaultRouter()
router.register("document", DocumentListViewSet, basename="document")
router.register("attachment", AttachmentViewset, basename="attachment")

urlpatterns = [
    path("vs/", include(router.urls)),
    path("detail/<uuid:uuid>/", DocumentDetailView.as_view()),
    path("attachment/<int:pk>/", AttachmentDetailView.as_view()),
    path("article/<uuid:uuid>/", PublicArticleDetailView.as_view()),
    path("article/activity/<uuid:uuid>/", DocumentActivityView.as_view()),
]
