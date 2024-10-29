from accounts.public_serializer import BasicUserSerializer
from rest_framework import serializers
from workflow.models import Workflow


class WorkflowApiSerializer(serializers.ModelSerializer):
    creator = BasicUserSerializer()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Workflow
        exclude = [
            "id",
        ]

    def get_url(self, obj):
        request = self.context.get("request")
        if not request:
            return None
        domain = request.META.get("HTTP_HOST")

        if domain == "127.0.0.1:8000":
            return f"http://127.0.0.1:3003/workflow/{obj.uuid}"
        else:
            return f"https://workflows.protium.space/workflow/{obj.uuid}"
