from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import GithubReleaseDetail
from .viewsets import GithubReleaseViewSet

router = DefaultRouter()
router.register("github-releases", GithubReleaseViewSet, basename="github-releases")

urlpatterns = [
    path("vs/", include(router.urls)),
    path("github-releases/<str:name>/", GithubReleaseDetail.as_view(), name="github-releases-detail"),
]
