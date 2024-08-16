from accounts.models import User
from django.db import models

from .abstract import BaseNodeDataBodyModel, BaseNodeDataCompileModel, BaseNodeDataHandleModel, BaseNodeDataModel


class NodeTemplateLibrary(models.Model):
    # 基础信息字段
    id: int

    name = models.CharField(max_length=100)  # name 用于在 template 中指定的节点的 key，不能包含空格
    description = models.TextField(blank=True, null=True)
    version = models.CharField(max_length=50, default="0.0.0")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, related_name="node_template_library")

    public = models.BooleanField(default=False)

    # 节点模板字段
    nodeTypes = (
        ("Solver", "Solver"),
        ("Basic", "Basic"),
        ("Select", "Select"),
        ("Input", "Input"),
    )
    type = models.CharField(
        max_length=50,
        choices=nodeTypes,
    )  # type 只有几个可选项，取决于 nodeTypes
    data: models.OneToOneField["NodeDataTemplate"]

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
