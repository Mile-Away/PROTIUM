from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ChannelDetailAPIView, ServerAdminsDetailAPIView
from .viewsets import ChannelListViewSet, ServerListViewSet, CategoryListViewSet

router = DefaultRouter()
router.register("select", ServerListViewSet, basename="server")
router.register("channel", ChannelListViewSet, basename="channel")
router.register("category", CategoryListViewSet, basename="category")

urlpatterns = [
    path("vs/", include(router.urls)),
    path("channel/<uuid:uuid>/", ChannelDetailAPIView.as_view(), name="channel_detail"),
    path("server/<str:name>/", ServerAdminsDetailAPIView.as_view(), name="server_detail"),
]
