from django.contrib import admin

from .models import Conversation, Message


class MessageAdmin(admin.ModelAdmin):
    list_display = ("sender", "content", "timestamp")
    # list_filter = ("sender",)
    search_fields = ("content",)
    ordering = ("timestamp",)


class ConversationAdmin(admin.ModelAdmin):
    list_display = ("channel_id", "channel", "created_at")
    search_fields = ("channel_id",)
    ordering = ("created_at",)


admin.site.register(Conversation)
admin.site.register(Message, MessageAdmin)
