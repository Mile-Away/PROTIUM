from django.contrib import admin

# Register your models here.
from .models import GlobalSearchHistory


class GlobalSearchHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "query", "timestamp")
    search_fields = ("user__username", "query")
    list_filter = ("timestamp",)


admin.site.register(GlobalSearchHistory, GlobalSearchHistoryAdmin)
