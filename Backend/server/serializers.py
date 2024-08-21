from typing import Optional

from document.serializer import DocumentSerializer, PublicArticleSerializer
from rest_framework import serializers
from webchat.serializer import MessageSerializer

from .models import Category, Channel, PinnedDocument, Server


class CategorySerializer(serializers.ModelSerializer):
    server_num = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = "__all__"

    def get_server_num(self, obj):
        return obj.server_category.count()


class ChannelSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    description = serializers.CharField()
    owner = serializers.StringRelatedField(read_only=True)
    members = serializers.StringRelatedField(many=True, read_only=True)
    admins = serializers.StringRelatedField(many=True, read_only=True)
    # server 返回 server 对象的 uuid 字段
    server = serializers.SlugRelatedField(slug_field="uuid", read_only=True)
    latest_message = MessageSerializer(read_only=True)

    class Meta:
        model = Channel
        exclude = ["id"]

    def create(self, validated_data):
        return super().create(validated_data)


class SearchChannelSerializer(serializers.Serializer):
    uuid = serializers.UUIDField()
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    server = serializers.SlugRelatedField(slug_field="uuid", required=False, read_only=True)


class PinnedDocumentSerializer(serializers.ModelSerializer):
    document = PublicArticleSerializer()
    server = serializers.SlugRelatedField(slug_field="name", read_only=True)

    class Meta:
        model = PinnedDocument
        fields = "__all__"


class ServerSerializer(serializers.ModelSerializer):

    num_members = serializers.SerializerMethodField()  # 自定义字段，需要加 SerializerMethodField
    # 返回 Server 对象的所有 Channel 对象
    channel_server = ChannelSerializer(many=True)  # 一对多关系，需要加 many=True
    readme = DocumentSerializer()
    pinned_manuscript = serializers.SerializerMethodField()
    # pinned_manuscript = PinnedDocumentSerializer(many=True, read_only=True)
    owner = serializers.StringRelatedField(read_only=True)
    admins = serializers.StringRelatedField(many=True, read_only=True)
    members = serializers.StringRelatedField(many=True, read_only=True)

    def __init__(self, *args, **kwargs):
        self.named = kwargs.pop("named", False)
        super(ServerSerializer, self).__init__(*args, **kwargs)
        if self.named:
            self.fields["owner_name"] = serializers.CharField(source="owner.username")
            self.fields["owner_avatar"] = serializers.CharField(source="owner.avatar.url")

    class Meta:
        model = Server
        exclude = ["id"]

    # def is_valid(self, raise_exception=False):
    #     # 如果定义了 is_valid 方法，views 中需要手动返回一个 dict 对象
    #     valid = super().is_valid(raise_exception=raise_exception)

    #     return valid

    def get_pinned_manuscript(self, obj):
        pinned_documents = PinnedDocument.objects.filter(server=obj).order_by("order")
        return PinnedDocumentSerializer(pinned_documents, many=True).data

    def get_num_members(self, obj) -> Optional[int]:
        if hasattr(obj, "num_members"):
            # return obj.members.count()
            return obj.num_members
        return None

    def to_internal_value(self, data):

        return super().to_internal_value(data)

    def to_representation(self, instance):
        # 这是原来会返回的数据，我先从其父类中获取 data
        data = super().to_representation(instance)
        # 如果没有 num_members 这个字段，就删除
        num_members = self.context.get("num_members")
        if not num_members:
            data.pop("num_members")

        return data

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
