import json
from typing import TypedDict
from uuid import uuid4

from bohrium_open_sdk import OpenSDK
from django.db.utils import IntegrityError
from rest_framework import authentication

from .models import ArithmeticAccess, User


class UserInfo(TypedDict):
    code: int
    data: dict[str, str]


class BohriumAuthentication(authentication.BaseAuthentication):

    UserModel = User

    def authenticate(self, request) -> User:
        auth_header = request.headers["Authorization"]
        scheme, _, credentials = auth_header.partition(" ")

        credentials = json.loads(credentials)

        appAccessKey = credentials["value"]

        print(">>>>>>>>>>>>>>>>>> Bohrium Access Key: ", appAccessKey)

        client = OpenSDK(access_key=appAccessKey, app_key="protium")

        user_info: UserInfo = client.user.get_info()

        if user_info.get("code") == 0:
            user_data: dict = user_info["data"]
            user_id = user_data["user_id"]
            username = user_data["name"]

            user, created = self.UserModel.objects.get_or_create(
                bohrium_account=user_id,
            )

            # 创建或更新 access token
            if created:
                ArithmeticAccess.objects.create(
                    user=user,
                    bohrium_access_token=appAccessKey,
                )

                # 创建用户名，用户名无需自动更新。
                try:
                    user.username = username
                    user.save()

                except IntegrityError:
                    print("Bohrium 用户名和已有用户名重复")
                    user.username = f"bohr_{user_id}"
                    user.save()
            else:
                access = ArithmeticAccess.objects.get(user=user)
                access.bohrium_access_token = appAccessKey
                access.save()

            return user

        else:
            raise Exception("Bohrium Authentication Failed")
