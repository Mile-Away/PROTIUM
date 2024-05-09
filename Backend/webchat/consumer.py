from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from server.models import Channel

from .models import Conversation, Message


class WebChatConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.channel = None
        self.channel_id = None
        self.user = None

    def connect(self):
        # 获取当前用户
        user = self.scope["user"]
        print("User >>>>>>>>>", user)

        # 判断用户是否登录, 如果登录则接受连接, 否则关闭连接
        if user.is_authenticated:
            self.accept()
            self.user = user
            # print("User >>>>>>>>>", user)

            self.channel_uuid = self.scope["url_route"]["kwargs"]["channelUUID"]

            # 获取频道
            channel = Channel.objects.get(uuid=self.channel_uuid)
            self.channel = channel
            self.channel_id = channel.id.to_bytes(16, byteorder="big").hex()

            if self.channel_layer is not None:
                async_to_sync(self.channel_layer.group_add)(
                    self.channel_id,
                    self.channel_name,
                )
        else:
            self.accept()
            self.send_json({"error": "Authentication failed"})
            self.close(code=4001)

    def receive_json(self, content=None, bytes_data=None, **kwargs):

        # channel_id = int(self.channel_id, 16)

        sender = self.user

        if content is not None:
            message = content["message"]

            conversation, created = Conversation.objects.get_or_create(channel=self.channel)

            new_message = Message.objects.create(Conversation=conversation, sender=sender, content=message)
            if self.channel is not None:
                self.channel.latest_message = new_message
                self.channel.save()

                if self.channel_layer is not None:
                    # 将消息发送到指定的频道组中的所有连接，返回给客户端
                    async_to_sync(self.channel_layer.group_send)(
                        self.channel_id,
                        {
                            "type": "chat.message",
                            "new_message": {
                                "id": new_message.id,
                                "sender": new_message.sender.username,
                                "content": new_message.content,
                                "timestamp": new_message.timestamp.isoformat(),
                                "avatar": new_message.sender.avatar.url,
                            },
                        },
                    )

    # 当有新消息通过 group_send 发送到频道组时，将调用此方法
    def chat_message(self, event):
        # message = event["new_message"]
        # self.send_json(text_data=json.dumps({"message": message}))
        self.send_json(event)

    def disconnect(self, code):
        if self.channel_layer is not None:
            async_to_sync(self.channel_layer.group_discard)(
                self.channel_id,
                self.channel_name,
            )
            super().disconnect(code)
