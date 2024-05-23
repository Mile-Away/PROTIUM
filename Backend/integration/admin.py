from django.contrib import admin

from .models import GithubAsset, GithubRelease, GithubServerIntergration, GithubUser


class GithubReleaseAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "tag_name", "server", "created_at")


admin.site.register(GithubServerIntergration)
admin.site.register(GithubUser)
admin.site.register(GithubAsset)
admin.site.register(GithubRelease, GithubReleaseAdmin)
