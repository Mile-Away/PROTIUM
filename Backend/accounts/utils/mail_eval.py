import smtplib
from random import Random

from accounts.models import EmailVerifyCode, User
from backend.settings import EMAIL_FROM
from django.core.mail import send_mail
from django.template import loader
from django.utils import timezone


def random_str(random_length=6):
    code_str = ""
    # 生成字符串的可选字符串
    # chars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789"
    chars = "0123456789"
    length = len(chars) - 1
    random = Random()
    for i in range(random_length):
        code_str += chars[random.randint(0, length)]

    return code_str


# 发送注册邮件和找回密码邮件
def mail_send(email, motive):
    # 发送之前先保存到数据库，到时候查询链接是否存在
    # 实例化一个EmailVerifyRecord对象
    email_record = EmailVerifyCode()
    # 生成随机的code放入链接
    captcha = random_str(6)
    email_record.captcha = captcha
    email_record.email = email
    email_record.motive = motive
    email_record.send_time = timezone.now()
    email_record.save()
    # print(email_record.id)
    ID = email_record.id

    active_address = captcha
    forget_address = captcha

    if motive == "register":
        email_title = "DeepModeling - 注册链接"
        email_body = loader.render_to_string(
            "mails/mail_register.html",  # 邮件里发送html(html模板)
            {
                "title": "Activate Your Account",
                "active_address": active_address,  # 激活地址链接
                "button": captcha,
            },
        )

        # "您正在注册国元行化工科技有限公司用户账号，请点击以下链接激活你的账号: http://127.0.0.1:8000/user/active/{0}".format(code)

        # 使用Django内置函数完成邮件发送。四个参数：主题，邮件内容，发件人邮箱地址，收件人（是一个字符串列表）
        try:
            send_status = send_mail(
                subject=email_title,
                message="",
                html_message=email_body,
                from_email=EMAIL_FROM,
                recipient_list=[email],
            )
            # 如果发送成功
            if send_status:
                print("Done.sent register email success")
                return True, ID

        except smtplib.SMTPException:
            import traceback

            traceback.print_exc()
            print("Error.sent register email fail")
            return False, ID

    if motive == "forget":
        email_title = "DeepModeling - 找回密码"
        email_body = loader.render_to_string(
            "mails/mail_forget.html",  # 邮件里发送html(html模板)
            {
                "title": "Change Your Password",
                "active_address": forget_address,  # 激活地址链接
                "button": captcha,
            },
        )
        # 如果发送成功
        try:
            send_status = send_mail(
                subject=email_title, message="", html_message=email_body, from_email=EMAIL_FROM, recipient_list=[email]
            )
            # 如果发送成功
            if send_status:
                print("Done.sent find password email success")

            return True, ID

        except smtplib.SMTPException:
            import traceback

            traceback.print_exc()
            print("Error.sent find password email fail")

            return False, ID

    return False, ID
