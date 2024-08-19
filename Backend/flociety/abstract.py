from django.db import models


class BaseNodeDataModel(models.Model):

    id: int

    header = models.TextField()
    footer = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True


class BaseNodeDataHandleModel(models.Model):
    id: int

    AS_CHOICES = (
        ("target", "Target"),
        ("source", "Source"),
    )

    data_source_choices = (
        ("handle", "Handle"),
        ("body", "Body"),
        ("compile", "Compile"),
    )
    # 只有不同的节点才能有相同的 key，同一个节点相同 type 的 key 不能相同，不同 type 的 key 可以相同
    # 所以 unique_together 是 ("node", "type", "key")
    # key 用来判断节点之间是否可以连接
    key = models.CharField(max_length=100)
    label = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=10, choices=AS_CHOICES)

    # source 储存这个作为 source handle，输出的数据的来源，只有三个选项，handle, body, result
    # source 的格式为 {"source": "handle", "key": "poscar"}
    # 或者 {"source": "body", "key": "input"}  # 一般来说，不会使用 body 作为 source
    # 或者 {"source": "result", "key": "poscar"}
    data_source = models.CharField(max_length=10, blank=True, null=True, choices=data_source_choices)
    data_key = models.CharField(max_length=100, blank=True, null=True)

    # TODO：即将废弃 rope 记录从一端连线时自动连接的节点
    rope = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        abstract = True


class BaseNodeDataBodyModel(models.Model):
    id: int

    key = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    source = models.JSONField(blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    attachment = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        abstract = True


class BaseNodeDataCompileModel(models.Model):
    id: int

    type_chocies = (("File", "File"),)

    key = models.CharField(max_length=100)
    script = models.CharField(max_length=100)
    source = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=50)
    title = models.CharField(max_length=100, blank=True, null=True)
    attachment = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        abstract = True


class BaseNodeBodySchemaModel(models.Model):
    id: int

    panel_type = models.CharField(max_length=100, default="default")
    schema = models.JSONField()
    uiSchema = models.JSONField()

    class Meta:
        abstract = True
