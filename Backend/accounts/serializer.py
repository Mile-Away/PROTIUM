from rest_framework import serializers

from .models import APITokens, ArithmeticAccess, EmailVerifyCode, User


class EmailVerifyCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailVerifyCode
        fields = "__all__"

    def is_valid(self, *, raise_exception: bool = False) -> bool:
        valid = super().is_valid(raise_exception=raise_exception)

        return valid

    def create(self, validated_data):
        verify_code = EmailVerifyCode.objects.create(
            email=validated_data["email"],
            captcha=validated_data["captcha"],
            motive=validated_data["motive"],
        )
        return verify_code


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = "__all__"
        exclude = (
            "password",
            "is_superuser",
        )


class APITokenSerializer(serializers.ModelSerializer):

    def is_valid(self, *, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)

    class Meta:
        model = APITokens
        fields = "__all__"


class ArithmeticAccessSerializer(serializers.ModelSerializer):

    def is_valid(self, *, raise_exception=False):
        return super().is_valid(raise_exception=raise_exception)

    class Meta:
        model = ArithmeticAccess
        fields = "__all__"


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username", "password")
        # extra_kwargs = {"password": {"write_only": True}}

    def is_valid(self, *, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)

        if valid:
            # 因为导入模型是在构建 json 序列化器的时候，所以在这里进行验证
            email = self.validated_data["email"]  # type: ignore
            if User.objects.filter(email=email).exists():
                self._errors["email"] = ["Email already exists"]  # type: ignore
                valid = False
            username = self.validated_data["username"]  # type: ignore
            if User.objects.filter(username=username).exists():
                self._errors["username"] = ["Username already exists"]  # type: ignore
                valid = False

        return valid

    def create(self, validated_data):
        user = User.objects.create_user(
            # 不可以改变顺序，原因需要参考 create_user 函数的源码
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=50)
    password = serializers.CharField(max_length=50)

    def is_valid(self, *, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)

        return valid
