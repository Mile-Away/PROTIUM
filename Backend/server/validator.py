import os

from django.core.exceptions import ValidationError
from PIL import Image


def validate_icon_image_size(image):
    if image:
        with Image.open(image) as (img):
            if img.height > 4096 or img.width > 4096:
                raise ValidationError("Image size should be less than 4096x4096")


def validate_image_file_extension(image):
    ext = os.path.splitext(image.name)[1]
    valid_ext = [".png", ".jpg", ".jpeg", ".gif", ".svg"]

    if not ext.lower() in valid_ext:
        raise ValidationError("Unsupported file extension.")
