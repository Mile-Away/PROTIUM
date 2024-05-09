from django.conf import settings
from django.db import models


# Create your models here.
class Conversation(models.Model):

    channel = models.ForeignKey("server.Channel", on_delete=models.CASCADE, related_name="conversation")
    created_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    id: int
    Conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
