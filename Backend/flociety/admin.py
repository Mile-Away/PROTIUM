from django.contrib import admin

# Register your models here.
from .models import (
    NodeDataBodyTemplate,
    NodeDataCompileTemplate,
    NodeDataHandleTemplate,
    NodeDataTemplate,
    NodeTemplateLibrary,
)


class NodeTemplateLibraryAdmin(admin.ModelAdmin):
    list_display = ("name", "version", "creator", "created_at", "updated_at")
    list_filter = ("name", "version", "creator", "created_at", "updated_at")
    search_fields = ("name", "version", "creator")


admin.site.register(NodeTemplateLibrary, NodeTemplateLibraryAdmin)
admin.site.register(NodeDataTemplate)
admin.site.register(NodeDataHandleTemplate)
admin.site.register(NodeDataBodyTemplate)
admin.site.register(NodeDataCompileTemplate)
