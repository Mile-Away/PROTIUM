from django.contrib import admin

# Register your models here.
from .models import (
    Workflow,
    WorkflowEdge,
    WorkflowNode,
    WorkflowNodeBody,
    WorkflowNodeCompile,
    WorkflowNodeData,
    WorkflowNodeHandle,
    WorkflowTask,
)


class WorkflowAdmin(admin.ModelAdmin):

    list_display = ("name", "creator", "public", "as_template", "uuid")
    search_fields = ("name", "uuid")
    ordering = ("id",)


class WorkflowNodeAdmin(admin.ModelAdmin):

    list_display = ("workflow", "template", "status")
    search_fields = ("workflow", "template", "status")
    ordering = ("id",)


class WorkflowNodeHandleAdmin(admin.ModelAdmin):
    list_display = ("node", "key", "hasConnected", "data_source")
    ordering = ("id",)


class WorkflowNodeBodyAdmin(admin.ModelAdmin):

    list_display = ("node", "key", "title", "type")
    ordering = ("id",)
    search_fields = ("node", "key")


class WorkflowNodeCompileAdmin(admin.ModelAdmin):

    list_display = (
        "node",
        "key",
        "script",
    )
    # search_fields = ()
    ordering = ("id",)


admin.site.register(Workflow, WorkflowAdmin)
admin.site.register(WorkflowNode, WorkflowNodeAdmin)
admin.site.register(WorkflowNodeData)
admin.site.register(WorkflowNodeHandle, WorkflowNodeHandleAdmin)
admin.site.register(WorkflowNodeBody, WorkflowNodeBodyAdmin)
admin.site.register(WorkflowNodeCompile, WorkflowNodeCompileAdmin)
admin.site.register(WorkflowEdge)
admin.site.register(WorkflowTask)
