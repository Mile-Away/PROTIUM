import uuid

from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .authentication import JWTCookieTokenObtainPairSerializer, JWTCookieTokenRefreshSerializer
from .models import APITokens, ArithmeticAccess, EmailVerifyCode, User
from .serializer import (
    APITokenSerializer,
    ArithmeticAccessSerializer,
    EmailVerifyCodeSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)
from .social_auth import BohriumAuthentication
from .utils.mail_eval import mail_send


class JWTSetCookieMixin:

    def finalize_response(self, request, response, *args, **kwargs):

        if response.data.get("refresh"):
            response.set_cookie(
                settings.SIMPLE_JWT["REFRESH_TOKEN_COOKIE_NAME"],
                response.data["refresh"],
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                domain=settings.SIMPLE_JWT["JWT_COOKIE_DOMAIN"],  # `domain`属性可以限制 cookie 只能发送到指定域名
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],  # `samesite`属性可以限制第三方站点发送的 cookie
                secure=settings.SIMPLE_JWT["JWT_COOKIE_SECURE"],  # `secure`属性可以限制 cookie 只能通过 HTTPS 协议发送
                httponly=False,
            )
            del response.data["refresh"]

        if response.data.get("access"):
            response.set_cookie(
                settings.SIMPLE_JWT["ACCESS_TOKEN_COOKIE_NAME"],
                response.data["access"],
                domain=settings.SIMPLE_JWT["JWT_COOKIE_DOMAIN"],  # `domain`限制 cookie 只能发送到指定域名
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
                secure=settings.SIMPLE_JWT["JWT_COOKIE_SECURE"],
                httponly=False,
            )
            del response.data["access"]

        return super().finalize_response(request, response, *args, **kwargs)  # type: ignore


class JWTCookieTokenObtainPairView(JWTSetCookieMixin, TokenObtainPairView):
    serializer_class = JWTCookieTokenObtainPairSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        if (
            isinstance(request.data, dict)
            and request.data.get("bohrium_account")
            and request.data.get("password") is None
        ):
            user = User.objects.get(bohrium_account=request.data["bohrium_account"])
            token = self.serializer_class.get_token(user)
            data = {"refresh": str(token), "access": str(token.access_token)}  # type: ignore

            return Response(data, status=status.HTTP_200_OK)
        else:
            return super().post(request, *args, **kwargs)


class JWTCookieTokenRefreshView(JWTSetCookieMixin, TokenRefreshView):
    serializer_class = JWTCookieTokenRefreshSerializer


class ApiTokenView(APIView):
    """
    View for retrieving the current user's API tokens.
    """

    serializer_class = APITokenSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the current user's API tokens.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the user's API tokens.
        """

        user = request.user
        if user:
            user = User.objects.get(id=user.id)
            tokens = user.api_tokens.all()
            serializer = self.serializer_class(tokens, many=True)
            data = serializer.data
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        Create a new API token for the current user.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the new API token.
        """
        print("data>>>>>>>", request.data)
        user = request.user
        if user:
            name = request.data.get("name")
            # 创建 uuidv4 token
            secret_token = str(uuid.uuid4())
            full_token = f"ptm_{secret_token}"
            token = APITokens.objects.create(user=user, name=name, token=full_token)
            serializer = self.serializer_class(token)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """
        Delete an API token for the current user.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response confirming the deletion of the API token.
        """
        user = request.user
        token_id = request.data.get("token_id")

        if user and token_id:
            try:
                token = APITokens.objects.get(id=token_id, user=user)
                token.delete()
                return Response({"success": "Token deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
            except APITokens.DoesNotExist:
                return Response({"error": "Token not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "User not found or token ID not provided"}, status=status.HTTP_400_BAD_REQUEST)


class ArithmeticAccessView(APIView):
    """
    View for retrieving the current user's Bohrium access token.
    """

    serializer_class = ArithmeticAccessSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the current user's Bohrium access token.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the user's Bohrium access token.
        """

        user: User = request.user
        if user:
            platform = request.query_params.get("platform")
            match platform:
                case "bohrium":
                    try:
                        bohrium_access_token = user.arithmetic_access.bohrium_access_token
                        if bohrium_access_token:
                            return Response({"bohrium_access_token": bohrium_access_token}, status=status.HTTP_200_OK)
                    except ArithmeticAccess.DoesNotExist:
                        return Response(
                            {"error": "Bohrium access token not found, please add it firstly"},
                            status=status.HTTP_404_NOT_FOUND,
                        )

                case _:
                    return Response({"error": "Unsupported platform"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        Retrieve the current user's Bohrium access token.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the user's Bohrium access token.
        """
        print(">>>>>", request.data)
        user = request.user
        if user:
            platform = request.query_params.get("platform")

            match platform:
                case "bohrium":
                    bohrium_access_token = request.data.get("bohrium_access_token")

                    if not bohrium_access_token:
                        return Response(
                            {"error": "Bohrium access token is required"}, status=status.HTTP_400_BAD_REQUEST
                        )

                    try:
                        bohrium_access_token, _ = ArithmeticAccess.objects.update_or_create(
                            user=user, defaults={"bohrium_access_token": bohrium_access_token}
                        )

                        serializer = self.serializer_class(bohrium_access_token)
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    except Exception as e:
                        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

                case _:
                    return Response({"error": "Unsupported platform"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """
        Retrieve the current user's Bohrium access token.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the user's Bohrium access token.
        """

        user = request.user
        if user:
            user = User.objects.get(id=user.id)
            data = request.data.copy()
            user.bohrium_account = data.get("bohrium_account")
            user.save()
            return Response({"bohrium_account": user.bohrium_account}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """
        Retrieve the current user's Bohrium access token.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the user's Bohrium access token.
        """

        user = request.user
        if user:
            user = User.objects.get(id=user.id)
            user.bohrium_account = None
            user.save()
            return Response({"bohrium_account": user.bohrium_account}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    """
    View for retrieving the current user's details.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve the current user's details.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the user's details.
        """

        user = request.user

        if user:
            user = self.queryset.get(id=user.id)
            # 为该用户设置最近 last_login 时间
            user.last_login = timezone.now()
            user.save()

            serializer = UserSerializer(user)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """
        Update the current user's details.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the user's details.
        """

        user = request.user
        if user:
            user = self.queryset.get(id=user.id)
            data = request.data.copy()
            serializer = self.serializer_class(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    View for logging out a user.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Log out a user.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing a message.
        """
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie(
            settings.SIMPLE_JWT["ACCESS_TOKEN_COOKIE_NAME"],
            domain=settings.SIMPLE_JWT["JWT_COOKIE_DOMAIN"],  # `domain`属性可以限制 cookie 只能发送到指定域名
        )
        response.delete_cookie(
            settings.SIMPLE_JWT["REFRESH_TOKEN_COOKIE_NAME"],
            domain=settings.SIMPLE_JWT["JWT_COOKIE_DOMAIN"],  # `domain`属性可以限制 cookie 只能发送到指定域名
        )
        return response


class RegisterView(APIView):
    """
    View for registering a new user.
    """

    serializer_class = RegisterSerializer

    def post(self, request):
        """
        Register a new user.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the user's ID, email, and username.
        """

        # auth_header 用来判断第三方登陆的情况
        try:
            auth_header = request.headers["Authorization"]

            if auth_header:

                print(">>>>> Enter", auth_header)
                scheme, _, credentials = auth_header.partition(" ")

                if scheme == "Bohrium":
                    auth = BohriumAuthentication()
                    try:
                        user: User = auth.authenticate(request)

                        return Response(
                            {
                                "id": user.id,
                                "username": user.username,
                                "bohrium_account": user.bohrium_account,
                            },
                            status=status.HTTP_201_CREATED,
                        )
                    except Exception as e:
                        return Response(
                            {"error": str(e)},
                            status=status.HTTP_401_UNAUTHORIZED,
                        )

        # 未找到 Authorization 头，说明是普通注册
        except KeyError:
            (email, username, password, captcha, captcha_id) = (
                request.data.get("email"),
                request.data.get("username"),
                request.data.get("password"),
                request.data.get("captcha"),
                request.data.get("captcha_id"),
            )

            serializer = RegisterSerializer(data={"email": email, "username": username, "password": password})

            if serializer.is_valid():
                username = serializer.validated_data["username"]  # type: ignore
                forbidden_usernames = [
                    "admin",
                    "administrator",
                    "moderator",
                    "mod",
                    "owner",
                    "root",
                    "superuser",
                    "su",
                ]
                if username.lower() in forbidden_usernames:
                    return Response(
                        {"error": "Username is forbidden"},
                        status=status.HTTP_409_CONFLICT,
                    )

                try:
                    email_verify_code = EmailVerifyCode.objects.get(id=captcha_id)
                    # print(email_verify_code.captcha)
                except EmailVerifyCode.DoesNotExist:
                    return Response(
                        {"error": "Captcha is not correct"},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                if email_verify_code.captcha != captcha:
                    return Response(
                        {"error": "Captcha is not correct"},
                        status=status.HTTP_401_UNAUTHORIZED,
                    )

                user: User = serializer.save()  # type: ignore

                return Response(
                    {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                    },
                    status=status.HTTP_201_CREATED,
                )

            errors = serializer.errors
            print(">>>>>", errors)
            if "username" in errors and "non_field_errors" not in errors:
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_409_CONFLICT,
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):

    serializer_class = ResetPasswordSerializer

    def post(self, request):
        (email, captcha, password) = (
            request.data.get("email"),
            request.data.get("captcha"),
            request.data.get("password"),
        )

        serializer = ResetPasswordSerializer(data={"email": email, "password": password})

        if serializer.is_valid():
            try:
                email_verify_code = EmailVerifyCode.objects.filter(email=email, motive="forget").latest("send_time")
            except EmailVerifyCode.DoesNotExist:
                return Response(
                    {"error": "Email is not exist"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if email_verify_code.captcha != captcha:
                return Response(
                    {"error": "Captcha is not correct"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = User.objects.get(email=email)
            user.set_password(password)
            user.save()

            return Response(
                {"message": "Password reset successful"},
                status=status.HTTP_200_OK,
            )
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailVerifyCodeView(APIView):
    """
    ViewSet for email verification codes.
    """

    serializer_class = EmailVerifyCodeSerializer

    def post(self, request):
        """
        Create a new email verification code.

        Args:
            request: The request sent to the server.

        Returns:
            Response: JSON response containing the email verification code.
        """
        serializer = EmailVerifyCodeSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]  # type: ignore
            motive = serializer.validated_data["motive"]  # type: ignore
            send_status, ID = mail_send(email, motive)
            if send_status:
                return Response(
                    {
                        "id": ID,
                        "email": email,
                        "motive": motive,
                    },
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"error": "Wrong Ooops, please resure your email"},
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY,
                )

        errors = serializer.errors
        print(">>>>>", errors)
        if "email" in errors and "non_field_errors" not in errors:
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
