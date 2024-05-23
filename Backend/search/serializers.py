from document.models import Document
from document.serializer import SearchPublicDocumentSerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from server.models import Channel
from server.serializers import SearchChannelSerializer

from .models import GlobalSearchHistory


class GlobalSearchSerializer(serializers.Serializer):
    documents = SearchPublicDocumentSerializer(many=True)
    channels = SearchChannelSerializer(many=True)


class GlobalSearchHistorySerializer(serializers.ModelSerializer):
    channel = SearchChannelSerializer(required=False)
    document = SearchPublicDocumentSerializer(required=False)

    class Meta:
        model = GlobalSearchHistory
        exclude = ["user"]

    # 如果定义了 is_valid 方法，views 中需要手动返回一个 dict 对象
    # def is_valid(self, raise_exception=False):
    #     if self.validated_data.get("type") == "channel":
    #         if not self.validated_data.get("channel"):
    #             return False
    #     elif self.validated_data.get("type") == "document":
    #         if not self.validated_data.get("document"):
    #             return False
    #     return super().is_valid(raise_exception=raise_exception)

    def to_internal_value(self, data):
        # 首先尝试从输入数据中提取 channel 或 document 的 uuid
        channel_uuid = data.get("channel", {}).get("uuid")
        document_uuid = data.get("document", {}).get("uuid")

        # 如果没有提供 channel 或 document 的 uuid，引发 ValidationError
        if not (channel_uuid or document_uuid):
            raise ValidationError("Either channel or document uuid must be provided")

        # 将提取的 uuid 传递给原始的 to_internal_value 方法，该方法将执行其他验证和转换
        validated_data = super().to_internal_value(data)

        # 根据需要设置 channel 或 document 属性
        if channel_uuid:
            validated_data["channel"] = Channel.objects.get(uuid=channel_uuid)
        if document_uuid:
            validated_data["document"] = Document.objects.get(uuid=document_uuid)

        return validated_data

    # 定义 create 方法，在视图中调用 serializer.save() 时会调用这个方法
    def create(self, validated_data):
        return super().create(validated_data)
