from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import User
from .public_serializer import BasicUserSerializer, PublicUserSerializer
from .schema import user_list_schema
from .serializer import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user accounts.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def check_email_exists(self, request):
        email = request.data.get("email")
        print(email)
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        email_exists = User.objects.filter(email=email).exists()
        if email_exists:
            return Response({"exists": True}, status=status.HTTP_200_OK)
        else:
            return Response({"exists": False}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def get_basic_info(self, request):
        username = request.query_params.get("username")
        if username:
            queryset = get_object_or_404(User, username=username)
            if queryset:
                searilizer = BasicUserSerializer(queryset)
                return Response(searilizer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def get_public_info(self, request):
        username = request.query_params.get("username")
        if username:
            queryset = get_object_or_404(User, username=username)
            if queryset:
                searilizer = PublicUserSerializer(queryset)
                return Response(searilizer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    @user_list_schema
    def list(self, request, *args, **kwargs):
        user = request.user

        if user:
            self.queryset = self.queryset.get(id=user.id)  # type: ignore
            # 为该用户设置最近 last_login 时间
            user.last_login = timezone.now()
            user.save()

            serializer = UserSerializer(self.queryset)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
