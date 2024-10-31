from django.core.validators import RegexValidator
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
    # key 用来判断节点之间是否可以连接, key 只允许字母、数字、横杠，特别注意不能包含下划线
    key = models.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9-]+$",
                message="Name can only contain letters, numbers, and hyphens. underscores is not allowed.",
            ),
        ],
        help_text="Key 只能包含字母，数字和横杠，不允许空格和下划线",
    )
    type = models.CharField(max_length=10, choices=AS_CHOICES)
    label = models.CharField(
        max_length=100, blank=True, null=True, help_text="Label 控制显示的文本，若为空则显示 key 的大写值"
    )

    # source 储存这个作为 source handle，输出的数据的来源，只有三个选项，handle, body, result
    # source 的格式为 {"source": "handle", "key": "poscar"}
    # 或者 {"source": "body", "key": "input"}  # 一般来说，不会使用 body 作为 source
    # 或者 {"source": "result", "key": "poscar"}
    data_source = models.CharField(max_length=10, blank=True, null=True, choices=data_source_choices)
    data_key = models.CharField(max_length=100, blank=True, null=True)

    # TODO：即将废弃 rope 记录从一端连线时自动连接的节点
    rope = models.CharField(max_length=100, blank=True, null=True, help_text="rope 即将失去作用，无需填写")

    class Meta:
        abstract = True


class BaseNodeDataBodyModel(models.Model):

    body_type_choices = (
        ("DEFAULT", "Default"),
        ("FILE", "File"),
        ("TEXTAREA", "Textarea"),
        ("SELECT", "Select"),
    )

    id: int
    key = models.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9-]+$",
                message="Name can only contain letters, numbers, and hyphens. underscores is not allowed.",
            ),
        ],
        help_text="Key 只能包含字母，数字和横杠，不允许空格和下划线，优先推荐小写字母与横杠",
    )

    type = models.CharField(
        max_length=50,
        choices=body_type_choices,
        default="Default",
        help_text="Default 使用 jsonSchema 控制用户输入内容，Textarea 使用纯文本框控制用户输入内容，File 为让用户上传文件, Select 为选择框",
    )

    # Optional
    title = models.CharField(max_length=100, blank=True, null=True, help_text="建议填写，控制输入框的 placeholder")
    source = models.JSONField(blank=True, null=True, help_text="source 为 body 的实际数据")
    select_choices = models.JSONField(
        blank=True, null=True, help_text="select_choices 为选择框的选项，为对象列表，包含 name，value 两个字段"
    )
    attachment = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        abstract = True


class BaseNodeDataCompileModel(models.Model):
    id: int

    compile_type_chocies = (
        ("Parameter", "Parameter"),
        ("Artifact", "Artifact"),
    )

    key = models.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9-]+$",
                message="Name can only contain letters, numbers, and hyphens. underscores is not allowed.",
            ),
        ],
        help_text="Key 只能包含字母，数字和横杠，不允许空格和下划线",
    )
    type = models.CharField(
        max_length=50,
        choices=compile_type_chocies,
        default="Parameter",
        help_text="Parameter 为参数，Artifact 为输出文件路径",
    )

    # Optional
    script = models.TextField(blank=True, null=True, max_length=100)
    source = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    readable = models.BooleanField(default=False)

    class Meta:
        abstract = True


class BaseNodeBodySchemaModel(models.Model):
    id: int

    panel_type = models.CharField(max_length=100, default="default")
    schema = models.JSONField()
    uiSchema = models.JSONField(blank=True, null=True)

    class Meta:
        abstract = True
