from accounts.public_serializer import BasicUserSerializer
from rest_framework import serializers

from .models import (
    NodeBodySchemaTemplate,
    NodeDataBodyTemplate,
    NodeDataCompileTemplate,
    NodeDataHandleTemplate,
    NodeDataTemplate,
    NodeTemplateLibrary,
    NodeTemplateVersion,
)


class NodeBodySchemaTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeBodySchemaTemplate
        exclude = ["id", "body"]


class NodeDataCompileTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NodeDataCompileTemplate
        exclude = ["id", "node"]

    def to_representation(self, instance: NodeDataCompileTemplate):
        ret = {key: value for key, value in instance.__dict__.items() if key != "bodies" and not key.startswith("_")}

        ret["bodies"] = [body.key for body in instance.bodies.all()]

        return ret


class NodeDataBodyTemplateSerializer(serializers.ModelSerializer):
    schema = NodeBodySchemaTemplateSerializer()

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


class NodeTemplateVersionSerializer(serializers.ModelSerializer):
    node = NodeTemplateLibrarySerializer()

    class Meta:
        model = NodeTemplateVersion
        exclude = ["id"]
