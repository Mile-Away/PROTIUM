# from channels.generic.websocket import JsonWebsocketConsumer
import asyncio
import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .executers import WorkflowExecuter
from .models import Workflow


class WorkflowConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.workflow = None
        self.workflow_id = None
        self.workflow_uuid = None
        self.running = False
        self.node = None
        self.running_node = None
        self.user = None

    async def connect(self):
        # 获取当前用户
        user = self.scope["user"]
        print("User >>>>>>>>>", user)

        # 判断用户是否登录, 如果登录则接受连接, 否则关闭连接
        if user.is_authenticated:
            await self.accept()
            self.user = user
            # print("User >>>>>>>>>", user)

            self.workflow_uuid = self.scope["url_route"]["kwargs"]["workflowUUID"]

            # 获取工作流
            self.workflow = await sync_to_async(Workflow.objects.get)(uuid=self.workflow_uuid)

            print("Workflow >>>>>>>>>", self.workflow)

            self.workflow_id = self.workflow.id.to_bytes(16, byteorder="big").hex()

            if self.channel_layer is not None:
                print("Adding to group >>>>>>>>", self.workflow_id)
                print("Channel Name >>>>>>>>", self.channel_name)
                await self.channel_layer.group_add(
                    self.workflow_id,
                    self.channel_name,
                )
        else:
            await self.accept()
            await self.send(text_data=json.dumps({"error": "Authentication failed"}))
            await self.close(code=4001)

    async def receive(self, text_data=None, bytes_data=None, **kwargs):

        print("Received JSON >>>>>>>>", text_data)
        if text_data == "start":
            self.running = True
            if self.workflow is not None:
                workflow_executer = WorkflowExecuter(self.workflow)
                asyncio.ensure_future(workflow_executer.execute())

    async def node_result(self, event):
        print("Node Result >>>>>>>>", event)
        await self.send(text_data=json.dumps(event))

    async def disconnect(self, code):
        if self.channel_layer is not None:
            await self.channel_layer.group_discard(
                self.workflow_id,
                self.channel_name,
            )
            await super().disconnect(code)
