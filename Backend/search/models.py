from django.conf import settings

# Create your models here.
from django.db import models
from django.utils import timezone


class GlobalSearchHistory(models.Model):

    source_choices = (("global", "Global"), ("channel", "Channel"))
    type_choices = (("document", "Document"), ("channel", "Channel"))

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="search_history")
    query = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=20, default="global", choices=source_choices)
    type = models.CharField(max_length=20, choices=type_choices)
    channel = models.ForeignKey("server.Channel", on_delete=models.CASCADE, null=True, blank=True)
    document = models.ForeignKey("document.Document", on_delete=models.CASCADE, null=True, blank=True)

    def str(self):
        return f"{self.user.username} - {self.query}"

    class Meta:
        verbose_name_plural = "Search Histories"
        ordering = ["-timestamp"]
