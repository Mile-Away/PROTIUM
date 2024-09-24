import re

from django.core.exceptions import ValidationError


def validate_node_name(username):
    if len(username) > 20:
        raise ValidationError("Node Name should be < 20 characters.")
    if len(username) < 2:
        raise ValidationError("Node Name should be > 2 characters.")

    # 用户名不允许中文
    if re.search(r"[\u4e00-\u9fa5]", username):
        raise ValidationError("Name should not contain Chinese characters.")

    # 第一位不能是数字
    if username[0].isdigit():
        raise ValidationError("Node Name should not start with a number.")

    forbidden_usernames = ["admin", "administrator", "moderator", "mod", "owner", "root", "superuser", "su"]
    if username.lower() in forbidden_usernames:
        raise ValidationError("Name is forbidden")
