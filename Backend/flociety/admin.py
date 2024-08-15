from django.contrib import admin

# Register your models here.
from .models import (
    NodeDataBodyTemplate,
    NodeDataCompileTemplate,
    NodeDataHandleTemplate,
    NodeDataTemplate,
    NodeTemplateLibrary,
)

admin.site.register(NodeTemplateLibrary)
admin.site.register(NodeDataTemplate)
admin.site.register(NodeDataHandleTemplate)
admin.site.register(NodeDataBodyTemplate)
admin.site.register(NodeDataCompileTemplate)
