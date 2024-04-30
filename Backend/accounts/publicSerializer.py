from document.models import Document
from document.serializer import PublicArticleSerializer
from rest_framework import serializers
from server.models import Server
from server.serializer import ServerSerializer


class PublicUserSerializer(serializers.Serializer):
    # id = serializers.IntegerField()
    username = serializers.CharField(max_length=50)
    avatar = serializers.ImageField()
    about = serializers.CharField(max_length=500)
    public_articles = serializers.SerializerMethodField()
    public_spaces = serializers.SerializerMethodField()
    # email = serializers.EmailField(max_length=50)
    # is_active = serializers.BooleanField()
    # last_login = serializers.DateTimeField()
    # date_joined = serializers.DateTimeField()

    def get_public_articles(self, obj):
        public_doucument = Document.objects.filter(author=obj, publish=True)
        serializer = PublicArticleSerializer(public_doucument, many=True)

        return serializer.data

    def get_public_spaces(self, obj):
        public_server = Server.objects.filter(owner=obj)
        serializer = ServerSerializer(public_server, many=True)

        return serializer.data


class BasicUserSerializer(serializers.Serializer):
    # id = serializers.IntegerField()
    username = serializers.CharField(max_length=50)
    avatar = serializers.ImageField()
    # email = serializers.EmailField(max_length=50)
    # is_active = serializers.BooleanField()
    # last_login = serializers.DateTimeField()
    # date_joined = serializers.DateTimeField()