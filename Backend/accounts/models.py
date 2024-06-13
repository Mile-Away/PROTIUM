import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .validator import validate_icon_image_size, validate_image_file_extension, validate_username


def user_avatar_path(instance, filename):
    return f"accounts/{instance.id}/avatar/{filename}"


# Create your models here.
class User(AbstractUser):
    # Required Fields
    id: int
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    username = models.CharField(max_length=20, null=False, blank=False, unique=True, validators=[validate_username])
    avatar = models.ImageField(
        upload_to=user_avatar_path,
        blank=True,
        default="accounts/default_avatar.png",
        validators=(validate_icon_image_size, validate_image_file_extension),
    )

    # Social Account[Optional]
    email = models.EmailField(max_length=50, null=True, blank=False, unique=True)
    bohrium_account = models.CharField(max_length=50, blank=True, null=True, unique=True)

    # Optional Fields
    about = models.TextField(max_length=500, blank=True, null=True)
    arithmetic_access: models.OneToOneField["ArithmeticAccess"]

    # Django Fields
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):

        # 将 email 字段转换为小写
        if self.email:
            self.email = self.email.lower()

        # 如果用户已经存在，删除旧头像
        if self.id:
            old_avatar = get_object_or_404(User, id=self.id).avatar
            if old_avatar and old_avatar != "accounts/default_avatar.png" and old_avatar != self.avatar:
                old_avatar.delete(save=False)
        super(User, self).save(*args, **kwargs)

    # def has_perm(self, perm, obj=None):
    #     return self.is_admin

    # def has_module_perms(self, app_lable):
    #     return True


class EmailVerifyCode(models.Model):
    """
    验证码
    """

    send_choices = (("register", "注册"), ("forget", "找回密码"))

    captcha = models.CharField("验证码", blank=True, null=True, max_length=20)
    email = models.EmailField("邮箱", max_length=50, unique=False)
    motive = models.CharField(choices=send_choices, max_length=10)
    send_time = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "EmailCaptchas"
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"{self.email}-{self.captcha}"


class UserSettings(models.Model):
    """
    用户设置
    """

    language_choices = (("en", "English"), ("zh", "简体中文"))
    theme_choices = (("light", "Light"), ("dark", "Dark"))

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="settings")
    theme = models.CharField(max_length=20, default="dark", choices=theme_choices)
    language = models.CharField(max_length=20, default="en", choices=language_choices)
    timezone = models.CharField(max_length=20, default="Asia/Shanghai")

    class Meta:
        verbose_name = "UserSettings"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.user.username


class UserResource(models.Model):
    """
    用户资源
    """

    pass


# 超算平台 access 信息模型
class ArithmeticAccess(models.Model):
    """
    超算平台 access 信息
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="arithmetic_access")
    bohrium_access_token = models.CharField(max_length=100, blank=True, null=True)
    bohrium_default_project = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.user.username} Arithmetic Access"
