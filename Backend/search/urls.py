from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import SearchChannelView, SearchDocumentView, SearchGlobalView
from .viewsets import GlobalSearchHistoryViewSet

router = DefaultRouter()
router.register("global-search-history", GlobalSearchHistoryViewSet, basename="global-search-history")

urlpatterns = [
    path("vs/", include(router.urls)),
    path("channel/<str:query>/", SearchChannelView.as_view(), name="search_channel"),
    path("document/<str:query>/", SearchDocumentView.as_view(), name="search_document"),
    path("global/<str:query>/", SearchGlobalView.as_view(), name="search_global"),
]
