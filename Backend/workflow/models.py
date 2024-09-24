import uuid

from accounts.models import User
from django.conf import settings
from django.db import models
from flociety.abstract import (
    BaseNodeDataBodyModel,
    BaseNodeDataCompileModel,
    BaseNodeDataHandleModel,
    BaseNodeDataModel,
)
from flociety.models import NodeTemplateLibrary


def workflow_cover_path(instance, filename):
    return f"workflow/{instance.id}/cover/{filename}"


class Workflow(models.Model):
    status_choices = (
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("running", "Running"),
        ("finished", "Finished"),
        ("canceled", "Canceled"),
        ("failed", "Failed"),
    )
    id: int
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator: User = models.ForeignKey(  # type: ignore
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="workflows"
    )
    status = models.CharField(max_length=50, choices=status_choices, default="draft")
    public = models.BooleanField(default=False)
    as_template = models.BooleanField(default=False)

    """
    EXPLAIN:
    通过在 Workflow 模型中定义 nodes: models.QuerySet["WorkflowNode"]，
    你可以表示 Workflow 模型与 WorkflowNode 模型之间存在一种关系，即一个工作流可以包含多个节点。
    这种关系通常通过在 WorkflowNode 模型中定义一个 ForeignKey 字段来建立。

    在定义 WorkflowNode 模型时，WorkflowNodeData 模型可能还没有被定义。
    通过使用字符串引用 "WorkflowNodeData"，你可以告诉 Django 在创建模型关系时，先使用一个字符串作为占位符，稍后再解析为实际的模型类。
    这样可以解决模型之间的循环依赖问题。

    nodes: models.QuerySet["WorkflowNode"] 只是一个类型注释，用于提示 nodes 字段与 WorkflowNode 模型相关联。
    它本身并不会创建实际的数据库字段或关系。实际的关系是通过在 WorkflowNode 模型中定义 ForeignKey 字段来建立的。
    """
    nodes: models.QuerySet["WorkflowNode"]
    edges: models.QuerySet["WorkflowEdge"]
    tasks: models.QuerySet["WorkflowTask"]

    def __str__(self):
        return self.name


class WorkflowConsole(models.Model):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name="consoles")
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField()

    def __str__(self):
        return f"{self.workflow}-{self.created_at}"


class WorkflowNode(models.Model):
    status_choices = (
        ("draft", "Draft"),
        ("skipped", "Skipped"),
        ("success", "Success"),
        ("failed", "Failed"),
        ("running", "Running"),
        ("pending", "Pending"),
    )
    id: int
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name="nodes")
    template = models.ForeignKey(NodeTemplateLibrary, on_delete=models.CASCADE)
    # type = models.CharField(max_length=50)
    position = models.JSONField(default=dict)
    positionAbsolute = models.JSONField(default=dict)
    width = models.IntegerField(default=200)
    height = models.IntegerField(default=250)
    dragHandle = models.CharField(max_length=50, blank=True, null=True, default=".drag-handle")
    status = models.CharField(max_length=10, choices=status_choices, default="draft")

    # 一个节点对应一个节点数据
    node_data: models.OneToOneField["WorkflowNodeData"]

    def __str__(self):
        return f"{self.uuid}"


class WorkflowNodeData(BaseNodeDataModel):
    node = models.OneToOneField(WorkflowNode, on_delete=models.CASCADE, related_name="node_data")

    handles: models.QuerySet["WorkflowNodeHandle"]
    body: models.QuerySet["WorkflowNodeBody"]
    compile: models.QuerySet["WorkflowNodeCompile"]

    def __str__(self):
        return f"{self.node}"


class WorkflowNodeHandle(BaseNodeDataHandleModel):

    node = models.ForeignKey(WorkflowNodeData, on_delete=models.CASCADE, related_name="handles")

    hasConnected = models.BooleanField(default=False)
    required = models.BooleanField(default=False)

    edges_sourceHandle: models.QuerySet["WorkflowEdge"]
    edges_targetHandle: models.QuerySet["WorkflowEdge"]

    class Meta:  # type: ignore
        unique_together = ("node", "type", "key")

    def __str__(self):
        return f"{self.node.node}_{self.type}_{self.key}"  # 这里的下划线不能随意修改，会影响前端渲染


class WorkflowNodeBody(BaseNodeDataBodyModel):
    # body 和 result 应该是多对多关系
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    node = models.ForeignKey(WorkflowNodeData, on_delete=models.CASCADE, related_name="body")

    compile: models.QuerySet["WorkflowNodeCompile"]

    class Meta:  # type: ignore
        unique_together = ("node", "key")

    def __str__(self):
        return f"{self.node.node}-{self.key}"


class WorkflowNodeCompile(BaseNodeDataCompileModel):
    # 使用 key 来和 source handle 对齐
    # 使用 script 来确定执行的脚本
    # 使用 source 存储执行结果
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    node = models.ForeignKey(WorkflowNodeData, on_delete=models.CASCADE, related_name="compile")

    bodies = models.ManyToManyField(WorkflowNodeBody, related_name="compile", blank=True)

    class Meta:  # type: ignore
        unique_together = ("node", "key")

    def __str__(self):
        return f"{self.node.node}-{self.key}"


class WorkflowNodeMessage(models.Model):
    type_choices = (
        ("info", "Info"),
        ("warning", "Warning"),
        ("error", "Error"),
    )

    node = models.ForeignKey(WorkflowNodeData, on_delete=models.CASCADE, related_name="messages")
    type = models.CharField(max_length=10, choices=type_choices, default="info")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.node}-{self.message[:5]}"


class WorkflowEdge(models.Model):
    connection_id = models.CharField(max_length=250, unique=True)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name="edges")
    source = models.ForeignKey(WorkflowNode, on_delete=models.CASCADE, related_name="edges_source")
    target = models.ForeignKey(WorkflowNode, on_delete=models.CASCADE, related_name="edges_target")
    sourceHandle = models.ForeignKey(WorkflowNodeHandle, on_delete=models.CASCADE, related_name="edges_sourceHandle")
    targetHandle = models.ForeignKey(WorkflowNodeHandle, on_delete=models.CASCADE, related_name="edges_targetHandle")

    def __str__(self):
        return f"reactflow__edge-{self.sourceHandle}-{self.targetHandle}"

    # def save(self, *args, **kwargs):
    #     if not self.connection_id:
    #         self.connection_id = f"reactflow__edge-{self.source.uuid}-{self.target.uuid}"
    #     return super().save(*args, **kwargs)


class WorkflowTask(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name="tasks")
    created_at = models.DateTimeField(auto_now_add=True)
    platform = models.CharField(max_length=50)
    task_id = models.CharField(max_length=100)
    finished_at = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50)
    output = models.TextField(blank=True, null=True)
    error = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.workflow}-{self.task_id}"
