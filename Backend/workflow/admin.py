from django.contrib import admin

# Register your models here.
from .models import Workflow, WorkflowEdge, WorkflowNode, WorkflowNodeBody, WorkflowNodeData, WorkflowNodeHandle

admin.site.register(Workflow)
admin.site.register(WorkflowNode)
admin.site.register(WorkflowNodeHandle)
admin.site.register(WorkflowNodeBody)
admin.site.register(WorkflowEdge)
admin.site.register(WorkflowNodeData)
