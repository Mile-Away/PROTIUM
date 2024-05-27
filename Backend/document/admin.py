from django.contrib import admin

from .models import Document, DocumentActivity, DocumentActivityUser, Tag


class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "created_at", "publish")
    sortable_by = ("updated_at", "title")


class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "creator", "created_at")
    sortable_by = ("created_at", "name")


# Register your models here.
admin.site.register(Document, DocumentAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(DocumentActivity)
admin.site.register(DocumentActivityUser)
