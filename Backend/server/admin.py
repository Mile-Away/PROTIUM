from django.contrib import admin

# Register your models here.
from .models import Category, Channel, PinnedDocument, Server


class ServerAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "description")
    search_fields = ("name", "description")
    ordering = ("name",)

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.members.add(form.instance.owner)
        form.instance.save()


class PinnedDocumentAdmin(admin.ModelAdmin):
    list_display = ("document", "server", "order")
    search_fields = ("document", "server")
    ordering = ("order",)


admin.site.register(Category)
admin.site.register(PinnedDocument, PinnedDocumentAdmin)
admin.site.register(Server, ServerAdmin)
admin.site.register(Channel)
