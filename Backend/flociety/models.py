from accounts.models import User
from django.core.validators import RegexValidator
from django.db import models

from .abstract import (
    BaseNodeBodySchemaModel,
    BaseNodeDataBodyModel,
    BaseNodeDataCompileModel,
    BaseNodeDataHandleModel,
    BaseNodeDataModel,
)
from .validates import validate_node_name


def workflow_cover_path(instance, filename):
    return f"workflow/{instance.id}/cover/{filename}"


class WorkflowTemplateLibrary(models.Model):
    workflow = models.OneToOneField("workflow.Workflow", on_delete=models.CASCADE, related_name="template")
    description = models.TextField(blank=True, null=True)

    # 用于工作流模版展示封面
    cover = models.FileField(blank=True, null=True, upload_to=workflow_cover_path)

    def __str__(self) -> str:
        return f"{self.workflow}"


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
        ("Step", "Step"),
        ("ILab", "ILab"),
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
