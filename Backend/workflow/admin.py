from django.contrib import admin

# Register your models here.
from .models import Workflow, WorkflowEdge, WorkflowNode, WorkflowNodeBody, WorkflowNodeData, WorkflowNodeHandle


class WorkflowNodeAdmin(admin.ModelAdmin):
    list_display = ("workflow", "type", "status", "created_at")
    search_fields = ("workflow", "type", "status", "created_at")
    ordering = ("created_at",)


admin.site.register(Workflow)
admin.site.register(WorkflowNode)
admin.site.register(WorkflowNodeHandle)
admin.site.register(WorkflowNodeBody)
admin.site.register(WorkflowEdge)
admin.site.register(WorkflowNodeData)
