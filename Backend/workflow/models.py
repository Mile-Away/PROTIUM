import uuid

from django.conf import settings
from django.db import models


class Workflow(models.Model):
    status_choices = (
        ("draft", "Draft"),
        ("pending", "Pending"),
        ("running", "Running"),
        ("finished", "Finished"),
        ("canceled", "Canceled"),
        ("failed", "Failed"),
    )
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="workflows")
    status = models.CharField(max_length=50, choices=status_choices, default="draft")
    public = models.BooleanField(default=False)

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

    def __str__(self):
        return self.name


class WorkflowNode(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name="nodes")
    type = models.CharField(max_length=50)
    position = models.JSONField(default=dict)
    positionAbsolute = models.JSONField(default=dict)
    width = models.IntegerField(default=200)
    height = models.IntegerField(default=250)
    dragHandle = models.CharField(max_length=50, blank=True, null=True)
    isRunning = models.BooleanField(default=False)

    # 一个节点对应一个节点数据
    node_data: models.OneToOneField["WorkflowNodeData"]

    def __str__(self):
        return f"{self.uuid}"


class WorkflowNodeData(models.Model):
    node = models.OneToOneField(WorkflowNode, on_delete=models.CASCADE, related_name="node_data")
    header = models.CharField(max_length=100)
    footer = models.TextField(blank=True, null=True)

    handles: models.QuerySet["WorkflowNodeHandle"]
    results: models.QuerySet["WorkflowResult"]
    body: models.QuerySet["WorkflowNodeBody"]

    def __str__(self):
        return f"{self.node}"


class WorkflowNodeHandle(models.Model):
    AS_CHOICES = (
        ("target", "Target"),
        ("source", "Source"),
    )
    # 只有不同的节点才能有相同的key，同一个节点相同 type 的key不能相同，不同 type 的key可以相同
    # 所以 unique_together 是 ("node", "type", "key")
    # key 用来判断节点之间是否可以连接
    key = models.CharField(max_length=100)
    node = models.ForeignKey(WorkflowNodeData, on_delete=models.CASCADE, related_name="handles")
    type = models.CharField(max_length=10, choices=AS_CHOICES)
    hasConnected = models.BooleanField(default=False)
    required = models.BooleanField(default=False)

    class Meta:
        unique_together = ("node", "type", "key")

    def __str__(self):
        return f"{self.node.node}_{self.type}_{self.key}"


class WorkflowNodeBody(models.Model):

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    node = models.ForeignKey(WorkflowNodeData, on_delete=models.CASCADE, related_name="body")
    key = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    source = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    attachment = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ("node", "key")

    def __str__(self):
        return f"{self.node.node}-{self.key}"


class WorkflowResult(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    node = models.ForeignKey(WorkflowNodeData, on_delete=models.CASCADE, related_name="results")
    key = models.CharField(max_length=100)
    source = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    attachment = models.CharField(max_length=100, blank=True, null=True)
    script = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ("node", "key")

    def __str__(self):
        return f"{self.node.node}-{self.key}"


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
