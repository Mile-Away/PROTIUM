from django.contrib import admin

from .models import ArithmeticAccess, EmailVerifyCode, User, UserSettings

# Register your models here.

"""
在Django中，`admin.site.register()`方法用于在admin站点上注册模型以便于进行管理。在这个例子中，`Account`模型是一个自定义的用户模型，用于替代Django默认的用户模型。

注册该模型时，可以选择将其注册为普通模型（使用`admin.site.register(Account)`）或者使用`UserAdmin`类（使用`admin.site.register(Account, UserAdmin)`）。

`UserAdmin`类是Django内置的一个特殊的Admin类，用于管理用户模型。它提供了一些额外的功能，如添加、编辑和删除用户，管理用户的权限等。通过使用`UserAdmin`类注册自定义用户模型，可以在admin站点上获得这些额外的功能，从而提高管理用户的效率。

总之，使用`admin.site.register(Account, UserAdmin)`可以让你在管理自定义用户模型`Account`时获得额外的管理功能，而不仅仅是将其注册为一个普通的模型。这对于管理用户来说是非常有帮助的。
"""


class EmailVerifyCodeAdmin(admin.ModelAdmin):
    list_display = ("email", "captcha", "motive", "send_time")
    list_filter = ("motive",)
    search_fields = ("email", "captcha")
    ordering = ("send_time",)


class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "date_joined", "last_login")
    search_fields = ("username", "email")
    list_filter = ("is_staff", "is_active")
    ordering = ("-last_login",)


class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ("user", "theme", "language", "timezone")
    search_fields = ("user",)
    list_filter = ("theme", "language", "timezone")
    ordering = ("user",)


admin.site.site_header = "Protium Administation"
admin.site.site_title = "Protium Administation"

admin.site.register(ArithmeticAccess)
admin.site.register(User, UserAdmin)
admin.site.register(EmailVerifyCode, EmailVerifyCodeAdmin)
admin.site.register(UserSettings, UserSettingsAdmin)