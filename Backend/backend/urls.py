from accounts.views import (
    EmailVerifyCodeView,
    JWTCookieTokenObtainPairView,
    JWTCookieTokenRefreshView,
    LogoutView,
    RegisterView,
    ResetPasswordView,
    UserDetailView,
)
from accounts.viewset import UserViewSet
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from webchat.consumer import WebChatConsumer
from webchat.viewsets import MessageListViewset
from workflow.consumer import WorkflowConsumer

router = DefaultRouter()

router.register("api/accounts", UserViewSet, basename="accounts")
router.register("api/message", MessageListViewset, basename="message")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/token/", JWTCookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", JWTCookieTokenRefreshView.as_view(), name="token_refresh"),
    # My APIs
    path("api/account/", UserDetailView.as_view()),
    path("api/account/register/", RegisterView.as_view(), name="register"),
    path("api/account/forget/", ResetPasswordView.as_view(), name="forget"),
    path("api/account/logout/", LogoutView.as_view(), name="logout"),
    path("api/account/email_eval/", EmailVerifyCodeView.as_view(), name="send_email"),
    path("api/server/", include("server.urls")),
    path("api/document/", include("document.urls")),
    path("api/search/", include("search.urls")),
    path("api/workflow/", include("workflow.urls")),
    # Social Login
    # path("accounts/", include("allauth.urls")),
] + router.urls

websocket_urlpatterns = [
    path("ws/<uuid:channelUUID>/", WebChatConsumer.as_asgi(), name="webchat"),
    path("ws/workflow/<uuid:workflowUUID>/", WorkflowConsumer.as_asgi(), name="workflow"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
