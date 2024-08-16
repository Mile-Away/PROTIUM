from rest_framework import serializers
from accounts.public_serializer import BasicUserSerializer
from .models import (
    NodeDataBodyTemplate,
    NodeDataCompileTemplate,
    NodeDataHandleTemplate,
    NodeDataTemplate,
    NodeTemplateLibrary,
)


class NodeDataCompileTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeDataCompileTemplate
        exclude = ["id", "node"]


class NodeDataBodyTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeDataBodyTemplate
        exclude = ["id", "node"]


class NodeDataHandleTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeDataHandleTemplate
        exclude = ["id", "node"]


class NodeDataTemplateSerializer(serializers.ModelSerializer):
    handles = NodeDataHandleTemplateSerializer(many=True)
    body = NodeDataBodyTemplateSerializer(many=True)
    compile = NodeDataCompileTemplateSerializer(many=True)

    class Meta:
        model = NodeDataTemplate
        exclude = ["id", "node"]


class NodeTemplateLibrarySerializer(serializers.ModelSerializer):
    node_data = NodeDataTemplateSerializer()
    creator = BasicUserSerializer(read_only=True)

    class Meta:
        model = NodeTemplateLibrary
        exclude = ["id"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["data"] = representation.pop("node_data")
        return representation
