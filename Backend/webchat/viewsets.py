from rest_framework import viewsets
from rest_framework.response import Response
from server.models import Channel

from .models import Conversation, Message
from .serializer import MessageSerializer


class MessageListViewset(viewsets.ViewSet):

    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def list(self, request):

        channel_uuid = request.query_params.get("channel_uuid")

        if not channel_uuid:
            return Response({"error": "Channel ID is required."})

        try:
            channel = Channel.objects.get(uuid=channel_uuid)
            conversation = Conversation.objects.get(channel=channel)

            messages = conversation.messages.all()

            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)

        except Conversation.DoesNotExist:
            return Response([])
