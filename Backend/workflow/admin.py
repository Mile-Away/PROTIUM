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


class WorkflowNodeAdmin(admin.ModelAdmin):
    def node_header(self, obj):
        return obj.node_data.header

    node_header.short_description = "Node Header"  # type: ignore

    list_display = ("workflow", "type", "status", "node_header")
    search_fields = ("workflow", "type", "status")
    ordering = ("id",)


class WorkflowNodeBodyAdmin(admin.ModelAdmin):
    def node_header(self, obj: WorkflowNodeBody) -> str:
        return obj.node.header

    node_header.short_description = "Node Header"  # type: ignore
    list_display = ("node", "key", "node_header")
    ordering = ("id",)
    search_fields = ("node", "key")


class WorkflowNodeHandleAdmin(admin.ModelAdmin):
    list_display = ("node", "key", "hasConnected", "data_source")
    ordering = ("id",)


class WorkflowNodeCompileAdmin(admin.ModelAdmin):
    def result_bodies(self, obj):
        return obj.bodies.all()

    result_bodies.short_description = "Result Bodies"  # type: ignore
    list_display = ("node", "key", "script", "result_bodies")
    # search_fields = ()
    ordering = ("id",)


admin.site.register(Workflow)
admin.site.register(WorkflowNode, WorkflowNodeAdmin)
admin.site.register(WorkflowNodeHandle, WorkflowNodeHandleAdmin)
admin.site.register(WorkflowNodeBody, WorkflowNodeBodyAdmin)
admin.site.register(WorkflowEdge)
admin.site.register(WorkflowNodeCompile, WorkflowNodeCompileAdmin)
admin.site.register(WorkflowTask)
admin.site.register(WorkflowNodeData)
