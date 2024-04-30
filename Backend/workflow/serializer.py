from uuid import UUID

from accounts.publicSerializer import BasicUserSerializer
from rest_framework import serializers

from .models import Workflow, WorkflowEdge, WorkflowNode, WorkflowNodeBody, WorkflowNodeData, WorkflowNodeHandle


class WorkflowNodeHandleSerializer(serializers.ModelSerializer):
    node = serializers.StringRelatedField(required=False)

    class Meta:
        model = WorkflowNodeHandle
        exclude = ["id"]


class WorkflowNodeBodySerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField()

    class Meta:
        model = WorkflowNodeBody
        exclude = ["id", "node"]

    def to_internal_value(self, data):
        if "id" in data:
            data["uuid"] = data.pop("id")
            print("data >>>>>>>>", data)
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["id"] = ret.pop("uuid")
        return ret


class WorkflowNodeDataSerializer(serializers.ModelSerializer):
    handles = WorkflowNodeHandleSerializer(many=True)
    body = WorkflowNodeBodySerializer(many=True)

    class Meta:
        model = WorkflowNodeData
        exclude = ["id", "node"]


class WorkflowNodeSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField()
    data = WorkflowNodeDataSerializer(many=False)

    class Meta:
        model = WorkflowNode
        exclude = ["id"]

    def to_internal_value(self, data):
        if "id" in data:
            data["uuid"] = data.pop("id")
        return super().to_internal_value(data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["id"] = ret.pop("uuid")
        return ret


class WorkflowEdgeSerializer(serializers.ModelSerializer):
    source = serializers.UUIDField()
    target = serializers.UUIDField()
    sourceHandle = serializers.StringRelatedField()
    targetHandle = serializers.StringRelatedField()

    class Meta:
        model = WorkflowEdge
        exclude = ["id", "workflow"]

    def to_internal_value(self, data):
        if "id" in data:
            data["connection_id"] = data.pop("id")
            if not WorkflowEdge.objects.filter(connection_id=data["connection_id"]).exists():
                return super().to_internal_value(data)
            else:
                return super().to_internal_value({"connection_id": "Exists"})

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["id"] = ret.pop("connection_id")

        return ret


class WorkflowSerializer(serializers.ModelSerializer):
    nodes = WorkflowNodeSerializer(many=True, required=False)
    edges = WorkflowEdgeSerializer(many=True, required=False)
    creator = BasicUserSerializer(read_only=True)

    class Meta:
        model = Workflow
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at", "creator", "uuid", "id", "isRunning")

    def is_valid(self, *, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # 处理嵌套字段
        nodes = validated_data.pop("nodes", [])
        edges = validated_data.pop("edges", [])

        # print("nodes_data >>>>>>>>", nodes_data)
        # 更新 Workflow 实例的基本字段
        instance = super().update(instance, validated_data)

        # 创建或更新节点
        for node in nodes:
            node_data = node.pop("data", {})
            node_handles = node_data.pop("handles", [])
            node_body = node_data.pop("body", [])

            # 更新 WorkflowNode 实例
            Node, created = WorkflowNode.objects.update_or_create(
                uuid=node["uuid"],
                workflow=instance,
                defaults=node,
            )

            # 更新 WorkflowNodeData 实例
            Node_Data, _ = WorkflowNodeData.objects.update_or_create(
                node=Node,
                defaults=node_data,
            )

            # 更新 WorkflowNodeHandle 实例
            for handle in node_handles:

                Handle, _ = WorkflowNodeHandle.objects.update_or_create(
                    # 根据模型中的 unique_together 字段来判断是否更新还是创建
                    node=Node_Data,
                    key=handle["key"],
                    type=handle["type"],
                    defaults=handle,
                )

            # 更新 WorkflowNodeBody 实例
            for body in node_body:

                Body, _ = WorkflowNodeBody.objects.update_or_create(
                    uuid=body["uuid"],
                    node=Node_Data,
                    defaults=body,
                )

        # 更新 WorkflowEdge 实例
        for edge in edges:

            if not edge["connection_id"] == "Exists":
                key = edge["connection_id"].split("_").pop()
                source = WorkflowNode.objects.get(uuid=edge["source"])
                target = WorkflowNode.objects.get(uuid=edge["target"])
                sourceHandle = WorkflowNodeHandle.objects.get(node=source.data, key=key)
                targetHandle = WorkflowNodeHandle.objects.get(node=target.data, key=key)
                WorkflowEdge.objects.create(
                    workflow=instance,
                    connection_id=edge["connection_id"],
                    source=source,
                    target=target,
                    sourceHandle=sourceHandle,
                    targetHandle=targetHandle,
                )

        return instance
