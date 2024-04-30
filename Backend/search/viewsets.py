from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from server.models import Channel

from .models import GlobalSearchHistory
from .serializers import GlobalSearchHistorySerializer


class CustomLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "limit"
    offset_query_param = "offset"
    max_limit = 100


class GlobalSearchHistoryViewSet(viewsets.ModelViewSet, CustomLimitOffsetPagination):
    queryset = GlobalSearchHistory.objects.all()
    serializer_class = GlobalSearchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return GlobalSearchHistory.objects.filter(
            user=self.request.user, source="global"
        )  # 不能将切片放到这里，get_queryset() 会缓存，所以记录不会变

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()[:10]

        serializer = GlobalSearchHistorySerializer(queryset, many=True)

        data = []

        for item in serializer.data:
            if item["type"] == "channel":
                data.append(item["channel"])
            elif item["type"] == "document":
                data.append(item["document"])
        return Response(data, status=status.HTTP_200_OK)

    # 重写 perform_create 方法，保存 user 字段, 而不是重写 create 方法，这是建议的做法
    def perform_create(self, serializer):

        type = serializer.validated_data.get("type")

        if type == "channel":
            channel = serializer.validated_data.get("channel")
            if not channel:
                return Response({"error": "Channel does not exist"}, status=status.HTTP_400_BAD_REQUEST)
            entry = self.get_queryset().filter(type=type, channel=channel, user=self.request.user).first()
            if entry:
                entry.timestamp = timezone.now()
                entry.save()
            else:
                serializer.save(user=self.request.user, channel=channel)
            return Response(status=status.HTTP_201_CREATED)

        elif type == "document":
            document = serializer.validated_data.get("document")

            if not document:
                return Response({"error": "Document does not exist"}, status=status.HTTP_400_BAD_REQUEST)

            entry = self.get_queryset().filter(type=type, document=document, user=self.request.user).first()
            if entry:
                entry.timestamp = timezone.now()
                entry.save()
            else:
                serializer.save(user=self.request.user, document=document)
            return Response(status=status.HTTP_201_CREATED)

        else:
            return Response({"error": "Invalid type"}, status=status.HTTP_400_BAD_REQUEST)
