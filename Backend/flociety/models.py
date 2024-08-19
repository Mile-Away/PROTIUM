import re

from accounts.models import User
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models

from .abstract import (
    BaseNodeBodySchemaModel,
    BaseNodeDataBodyModel,
    BaseNodeDataCompileModel,
    BaseNodeDataHandleModel,
    BaseNodeDataModel,
)


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


class NodeTemplateLibrary(models.Model):
    # 基础信息字段
    id: int

    name = models.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9_-]+$", message="Name can only contain letters, numbers, underscores, and hyphens."
            ),
            validate_node_name,
        ],
    )  # name 用于在 template 中指定的节点的 key，只能是字符，数字，下划线和短横线
    description = models.TextField(blank=True, null=True)
    version = models.CharField(max_length=50, default="0.0.0")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, related_name="node_template_library")

    public = models.BooleanField(default=False)

    # 节点模板字段
    nodeTypes = (
        ("Sequential", "Sequential"),
        ("Solver", "Solver"),
        ("Basic", "Basic"),
        ("Select", "Select"),
        ("Input", "Input"),
    )
    type = models.CharField(
        max_length=50,
        choices=nodeTypes,
    )  # type 只有几个可选项，取决于 nodeTypes
    node_data: models.OneToOneField["NodeDataTemplate"]

    # name 和 version 唯一确定一个节点模板
    class Meta:
        unique_together = ("name", "version")

    def __str__(self):
        return f"{self.name}-{self.version}"


class NodeDataTemplate(BaseNodeDataModel):
    id: int

    node = models.OneToOneField(NodeTemplateLibrary, on_delete=models.CASCADE, related_name="node_data")

    handles: models.QuerySet["NodeDataHandleTemplate"]
    body: models.QuerySet["NodeDataBodyTemplate"]
    compile: models.QuerySet["NodeDataCompileTemplate"]

    def __str__(self):
        return f"{self.node.name}-{self.node.version}"


class NodeDataHandleTemplate(BaseNodeDataHandleModel):

    node = models.ForeignKey(NodeDataTemplate, on_delete=models.CASCADE, related_name="handles")

    class Meta:  # type: ignore
        unique_together = ("node", "type", "key")

    def __str__(self):
        return f"{self.node.node}_{self.type}_{self.key}"  # 这里的下划线不能随意修改，会影响前端渲染


class NodeDataBodyTemplate(BaseNodeDataBodyModel):

    node = models.ForeignKey(NodeDataTemplate, on_delete=models.CASCADE, related_name="body")

    compile: models.QuerySet["NodeDataCompileTemplate"]

    schema: models.OneToOneField["NodeBodySchemaTemplate"]

    class Meta:  # type: ignore
        unique_together = ("node", "key")

    def __str__(self):
        return f"{self.node.node}-{self.key}"


class NodeDataCompileTemplate(BaseNodeDataCompileModel):

    node = models.ForeignKey(NodeDataTemplate, on_delete=models.CASCADE, related_name="compile")

    bodies = models.ManyToManyField(NodeDataBodyTemplate, related_name="compile", blank=True)

    class Meta:  # type: ignore
        unique_together = ("node", "key")

    def __str__(self):
        return f"{self.node.node}-{self.key}"


class NodeBodySchemaTemplate(BaseNodeBodySchemaModel):
    id: int

    body = models.OneToOneField(NodeDataBodyTemplate, on_delete=models.CASCADE, related_name="schema")
    # description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.body}"
