from __future__ import annotations

from typing import Any, Dict, Tuple, TypedDict

from django.conf import settings

# from bohrium_open_sdk import OpenSDK
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.tokens import Token

from .models import APITokens
from .models import User as AuthUser


class UserInfo(TypedDict):
    code: int
    data: dict[str, str]


# API Token Authentication
class APITokenAuthentication(BaseAuthentication):
    """
    Authenticate the request using an API token.
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization") or None

        if auth_header is None:
            return None

        try:
            prefix, token = auth_header.split(" ")
            if prefix.lower() != "bearer":
                raise AuthenticationFailed("Invalid token prefix")
        except ValueError:
            raise AuthenticationFailed("Invalid token header format")

        try:
            api_token = APITokens.objects.get(token=token, expired=False)
        except APITokens.DoesNotExist:
            raise AuthenticationFailed("Invalid or expired token")

        return (api_token.user, api_token)


class JWTCookieAuthentication(JWTAuthentication):
    def authenticate(self, request: Request) -> Tuple[AuthUser, Token] | None:

        raw_access_token = request.COOKIES.get(settings.SIMPLE_JWT["ACCESS_TOKEN_COOKIE_NAME"]) or None

        if raw_access_token is None:
            return None

        validated_token = self.get_validated_token(raw_access_token)
        validated_user = self.get_user(validated_token)
        return (validated_user, validated_token)


class JWTCookieTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user) -> Token:

        token: Token = super().get_token(user)

        return token

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:

        data = super().validate(attrs)
        # data["user_id"] = self.user.id

        return data


class JWTCookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:

        attrs["refresh"] = self.context["request"].COOKIES.get(settings.SIMPLE_JWT["REFRESH_TOKEN_COOKIE_NAME"])
        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise InvalidToken("No refresh token found in request")
