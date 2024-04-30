import os
import uuid
from datetime import datetime

from accounts.models import User
from django.db import models
from django.dispatch import receiver


def document_image_path(instance, filename):
    ext = filename.split(".")[-1]
    current_time = datetime.now().strftime("%Y%m%d%H%M%S")
    uuid_hex = uuid.uuid4().hex[:8]
    mixed_filename = "".join([c1 + c2 for c1, c2 in zip(uuid_hex, current_time)]) + uuid_hex[-1]
    filename = "{}.{}".format(mixed_filename, ext)
    sub_folder = "image"
    return os.path.join(
        "attachment", f"{instance.document.author.id}", f"{instance.document.uuid}", sub_folder, filename
    )


# Create your models here.
class Tag(models.Model):
    name = models.CharField(max_length=50)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Document(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=100, null=False, blank=True)
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="document_author")
    cooperators = models.ManyToManyField(User, related_name="cooperators", blank=True)
    tags = models.ManyToManyField(Tag, related_name="tags", blank=True)
    publish = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.author.username}_{self.title}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class DocumentActivity(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE)
    view = models.PositiveIntegerField(default=0)
    agree = models.PositiveIntegerField(default=0)
    disagree = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.document.title

    def get_agree_users(self):
        return User.objects.filter(documentactivityuser__activity=self, documentactivityuser__vote="agree")

    def get_disagree_users(self):
        return User.objects.filter(documentactivityuser__activity=self, documentactivityuser__vote="disagree")


class DocumentActivityUser(models.Model):
    activity = models.ForeignKey(DocumentActivity, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vote = models.CharField(max_length=10, choices=(("agree", "Agree"), ("disagree", "Disagree")))

    class Meta:
        unique_together = (
            "activity",
            "user",
        )


class Attachment(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=document_image_path)
    size = models.BigIntegerField(null=True, blank=True)

    def __str__(self):
        return self.image

    def save(self, *args, **kwargs):
        if self.image:
            # Calculate the size of the image
            size = self.image.size
            self.size = size

        super().save(*args, **kwargs)

    @receiver(models.signals.post_delete, sender="document.Attachment")
    def attachment_delete(sender, instance, **kwargs):
        # instance.icon.delete(save=False)
        for field in instance._meta.fields:
            if field.get_internal_type() == "FileField" or field.get_internal_type() == "ImageField":
                instance_field = getattr(instance, field.name)
                if instance_field:
                    instance_field.delete(save=False)
