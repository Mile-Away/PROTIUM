from rest_framework import serializers

from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = "__all__"

    def get_avatar(self, obj):
        return obj.sender.avatar.url
