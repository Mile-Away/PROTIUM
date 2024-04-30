import re
import os

from django.core.exceptions import ValidationError
from PIL import Image


def validate_icon_image_size(image):
    if image:
        with Image.open(image) as (img):
            if img.height > 1024 or img.width > 1024:
                raise ValidationError("Image size should be less than 1024x1024 pixels.")


def validate_image_file_extension(image):
    ext = os.path.splitext(image.name)[1]
    valid_ext = [".png", ".jpg", ".jpeg", ".webp"]

    if not ext.lower() in valid_ext:
        raise ValidationError("Only .png, .jpg, .jpeg, .webp, .svg files are allowed.")


def validate_username(username):
    if len(username) > 20:
        raise ValidationError("Username should be < 20 characters.")
    if len(username) < 3:
        raise ValidationError("Username should be > 3 characters.")

    char_eval = username.isalnum() or "_" in username
    if not char_eval:
        raise ValidationError("Only alphabets, numbers and _ are allowed.")

    # 用户名不允许中文
    if re.search(r'[\u4e00-\u9fa5]', username):
        raise ValidationError("Username should not contain Chinese characters.")

    if username[0].isdigit():
        raise ValidationError("Username should not start with a number.")

    forbidden_usernames = ["admin", "administrator", "moderator", "mod", "owner", "root", "superuser", "su"]
    if username.lower() in forbidden_usernames:
        raise ValidationError("Username is forbidden")
