from rest_framework import serializers
from workflow.models import Workflow


class WorkflowApiSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Workflow
        exclude = ["id",]

    def get_url(self, obj):
        return f"https://workflows.protium.space/workflow/{obj.uuid}"

