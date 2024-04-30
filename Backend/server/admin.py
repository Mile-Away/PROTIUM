from django.contrib import admin

# Register your models here.
from .models import Category, Channel, Server


class ServerAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "category", "description")
    list_filter = ("category",)
    search_fields = ("name", "description")
    ordering = ("name",)

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.members.add(form.instance.owner)
        form.instance.save()


admin.site.register(Category)
admin.site.register(Server, ServerAdmin)
admin.site.register(Channel)
