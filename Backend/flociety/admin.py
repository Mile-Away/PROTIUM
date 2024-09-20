from django.contrib import admin

# Register your models here.
from .models import (
    NodeDataBodyTemplate,
    NodeDataCompileTemplate,
    NodeDataHandleTemplate,
    NodeDataTemplate,
    NodeTemplateLibrary,
    NodeBodySchemaTemplate,
)


class NodeTemplateLibraryAdmin(admin.ModelAdmin):
    list_display = ("name", "version", "creator", "created_at", "updated_at")
    list_filter = ("name", "version", "creator", "created_at", "updated_at")
    search_fields = ("name", "version", "creator")


class NodeDataTemplateAdmin(admin.ModelAdmin):
    list_display = ("node",)
    list_filter = ("node",)
    search_fields = ("node",)


class NodeDataHandleTemplateAdmin(admin.ModelAdmin):
    list_display = ("node", "type", "key")
    list_filter = ("node", "type", "key")
    search_fields = ("node", "type", "key")


class NodeDataBodyTemplateAdmin(admin.ModelAdmin):
    list_display = ("node", "key")
    list_filter = ("node", "key")
    search_fields = ("node", "key")


class NodeDataCompileTemplateAdmin(admin.ModelAdmin):
    list_display = ("node", "key")
    list_filter = ("node", "key")
    search_fields = ("node", "key")


admin.site.register(NodeTemplateLibrary, NodeTemplateLibraryAdmin)
admin.site.register(NodeDataTemplate, NodeDataTemplateAdmin)
admin.site.register(NodeDataHandleTemplate, NodeDataHandleTemplateAdmin)
admin.site.register(NodeDataBodyTemplate, NodeDataBodyTemplateAdmin)
admin.site.register(NodeDataCompileTemplate, NodeDataCompileTemplateAdmin)
admin.site.register(NodeBodySchemaTemplate)