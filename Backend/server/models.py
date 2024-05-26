import uuid

from django.conf import settings
from django.contrib.auth.models import Group
from django.db import models
from django.dispatch import receiver
from django.shortcuts import get_object_or_404

from document.models import Document
from webchat.models import Message

from .validator import validate_icon_image_size, validate_image_file_extension


# Create your models here.
def channel_icon_path(instance, filename):
    return f"channel/{instance.id}/icon/{filename}"


def server_banner_path(instance, filename):
    return f"server/{instance.id}/banner/{filename}"


def category_icon_path(instance, filename):
    return f"category/{instance.id}/category/{filename}"


def server_icon_path(instance, filename):
    return f"server/{instance.id}/icon/{filename}"


class Category(models.Model):
    id: int
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.FileField(
        upload_to=category_icon_path,
        blank=True,
        null=True,
        validators=(validate_icon_image_size, validate_image_file_extension),
    )
    server_category: models.QuerySet["Server"]

    def save(self, *args, **kwargs):
        if self.id:
            old_icon = get_object_or_404(Category, id=self.id).icon
            if old_icon and old_icon != self.icon:
                old_icon.delete(save=False)
        super(Category, self).save(*args, **kwargs)

    @receiver(models.signals.post_delete, sender="server.Category")
    def category_delete(sender, instance, **kwargs):
        # instance.icon.delete(save=False)
        for field in instance._meta.fields:
            if field.get_internal_type() == "FileField" or field.get_internal_type() == "ImageField":
                instance_field = getattr(instance, field.name)
                if instance_field:
                    instance_field.delete(save=False)

    def __str__(self):
        return self.name


class Server(models.Model):
    id: int
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=1024, blank=True, null=True)
    chinese_description = models.CharField(max_length=500, blank=True, null=True)
    icon = models.ImageField(
        upload_to=server_icon_path,
        blank=True,
        null=True,
        validators=(validate_icon_image_size, validate_image_file_extension),
        help_text="展示在列表中的 Logo 图片",
    )
    banner = models.ImageField(
        upload_to=server_banner_path, blank=True, null=True, help_text="创建服务器时，展示在首页的图片"
    )
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="server_owner")
    admins = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="server_admins")
    readme = models.ForeignKey(
        Document, blank=True, null=True, on_delete=models.SET_NULL, related_name="server_readme"
    )
    pinned_manuscript = models.ManyToManyField(
        Document, blank=True, help_text="管理员在创建 Space 时 pin 在首页的文档"
    )
    github_url = models.URLField(blank=True, null=True, help_text="Space 对应的 Github 地址")
    document_url = models.URLField(blank=True, null=True, help_text="Space 对应的 Doc 文件夹的地址")

    category = models.ManyToManyField(Category, blank=True, related_name="server_category")
    created_at = models.DateTimeField(auto_now_add=True)

    members = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="server_members")
    groups = models.ManyToManyField(Group, blank=True, related_name="server_groups")
    enable_releases = models.BooleanField(default=False, help_text="是否展示 Github Release")
    enable_discussion = models.BooleanField(default=False, help_text="是否开启讨论区")
    github: models.OneToOneField["integration.GithubServerIntergration"]  # type: ignore  # noqa: F821
    # github: models.OneToOneField["integration.GithubServerIntergration"]

    def save(self, *args, **kwargs):
        is_new = not self.id

        if self.id:
            old_icon = get_object_or_404(Server, id=self.id).icon
            if old_icon and old_icon != self.icon:
                old_icon.delete(save=False)

        super(Server, self).save(*args, **kwargs)

        if is_new:
            self.members.add(self.owner)

    @receiver(models.signals.post_delete, sender="server.Server")
    def server_delete(sender, instance, **kwargs):
        # instance.icon.delete(save=False)
        for field in instance._meta.fields:
            if field.get_internal_type() == "FileField" or field.get_internal_type() == "ImageField":
                instance_field = getattr(instance, field.name)
                if instance_field:
                    instance_field.delete(save=False)

    def __str__(self):
        return self.name


class Channel(models.Model):

    privacy_choices = [
        ("public", "Public"),
        ("apply", "Apply"),
        ("memberOnly", "MemberOnly"),
        ("private", "Private"),
    ]

    progress_choices = [
        ("archived", "Archived"),
        ("inProgress", "InProgress"),
        ("completed", "Completed"),
    ]
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="channel_owner")
    admins = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="channel_admins")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="channel_members")

    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name="channel_server")

    icon = models.FileField(
        upload_to=channel_icon_path,
        blank=True,
        null=True,
        validators=(validate_image_file_extension, validate_icon_image_size),
    )
    latest_message = models.ForeignKey(
        Message, blank=True, null=True, on_delete=models.SET_NULL, related_name="channel_latest_message"
    )

    privacy = models.CharField(choices=privacy_choices, default="public", max_length=20)
    progress = models.CharField(choices=progress_choices, default="inProgress", max_length=20)

    id: int

    def save(self, *args, **kwargs):
        # if self.server.owner not in self.server.members.all():
        #     self.server.members.add(self.server.owner)
        # self.name = self.name.lower()
        if self.id:
            old_icon = get_object_or_404(Channel, id=self.id).icon
            if old_icon and old_icon != self.icon:
                old_icon.delete(save=False)
        super(Channel, self).save(*args, **kwargs)

    @receiver(models.signals.post_delete, sender="server.Channel")
    def channel_delete(sender, instance, *args, **kwargs):
        # instance.icon.delete(save=False)
        for field in instance._meta.fields:
            if field.get_internal_type() == "FileField" or field.get_internal_type() == "ImageField":
                instance_field = getattr(instance, field.name)
                if instance_field:
                    instance_field.delete(save=False)

    def __str__(self):
        return self.name
