import re

from accounts.models import User
from accounts.serializer import UserSerializer
from backend.utils import HighlightedCharField
from rest_framework import serializers

from .models import Attachment, Document, DocumentActivity, Tag


def filter_markdown_images(content):
    # 正则表达式匹配 ! 格式的 Markdown 图片
    image_pattern = r"!\[.*?\]\(.*?\)"

    # 使用 re.sub 函数替换所有匹配的图片标签为空字符串
    filtered_content = re.sub(image_pattern, "", content)

    return filtered_content


def filter_markdown_code_blocks(content):
    # 正则表达式匹配以 ``` 开头和结尾的代码块
    code_block_pattern = r"```.*?```"

    # 使用 re.sub 函数替换所有匹配的代码块为空字符串
    content = re.sub(code_block_pattern, "", content, flags=re.DOTALL)

    # 替换所有的 ``` 所在的一行为空字符串
    content = re.sub(r"^```.*$", "", content, flags=re.MULTILINE)

    # 替换所有处于每行开头的 \n 和空格
    content = re.sub(r"^[\n\s]+", "", content)

    return content


class TagSerializer(serializers.Serializer):
    name = serializers.CharField()


class DocumentListSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    cooperators = UserSerializer(many=True, required=False)
    tags = TagSerializer(many=True, required=False)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Document
        exclude = ("content",)
        read_only_fields = (
            "author",
            "created_at",
        )

    def get_avatar(self, obj):
        return obj.author.avatar.url


class DocumentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()  # 这个会显示 author 对应的 User 模型的 __str__ 属性
    author_id = serializers.IntegerField(read_only=True, required=False)
    cooperators = UserSerializer(many=True, required=False)
    tags = TagSerializer(many=True, required=False)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = "__all__"

        read_only_fields = (
            "author",
            "created_at",
        )

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)

        return valid

    def to_internal_value(self, data):
        # 调用父类的 to_internal_value 方法，以便它仍然执行正常的数据转换和验证
        validated_data = super().to_internal_value(data)

        # 将 tags 添加到 validated_data
        if "tags" in data:
            validated_data["tags"] = data["tags"]

        return validated_data

    def create(self, validated_data):
        print(validated_data)
        tags = validated_data.pop("tags", [])
        print(tags)
        document = Document.objects.create(**validated_data)
        document = self.create_and_bind_tags(document, tags)
        return document

    def update(self, instance, validated_data):
        tag_names = validated_data.pop("tags", [])
        # instance.title = validated_data.get("title", instance.title)
        # instance.content = validated_data.get("content", instance.content)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self.create_and_bind_tags(instance, tag_names)
        return instance

    def create_and_bind_tags(self, document, tag_names):
        if tag_names:
            for tag_name in tag_names:
                print(tag_name)
                tag, created = Tag.objects.get_or_create(name=tag_name["name"], creator=document.author)
                document.tags.add(tag)

        return document

    def get_avatar(self, obj):
        return obj.author.avatar.url


class AttachmentSerializer(serializers.ModelSerializer):
    document = serializers.StringRelatedField()

    class Meta:
        model = Attachment
        fields = "__all__"

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)

        return valid

    def create(self, validated_data):
        document = validated_data.pop("document")
        attachment = Attachment.objects.create(document=document, **validated_data)
        return attachment

    def update(self, instance, validated_data):

        instance.title = validated_data.get("title", instance.title)
        instance.content = validated_data.get("content", instance.content)
        instance.save()
        return instance


class PublicArticleSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    author_id = serializers.IntegerField(read_only=True, required=False)
    """
    `SerializerMethodField` 是 Django REST framework 中的一个特殊字段，它允许你自定义如何序列化某个字段。
    当你使用 `SerializerMethodField` 定义一个字段时，
    Django REST framework 会在序列化过程中自动寻找一个名为 `get_<field_name>` 的方法
    （在这个例子中，就是 `get_content` 方法），并调用它以获取该字段的序列化值。
    """
    content = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = (
            "author",
            "created_at",
        )

    def get_content(self, obj):
        # 使用 filter_markdown_images 函数过滤图片内容
        filtered_content = filter_markdown_images(obj.content)
        # filtered_content = filter_markdown_code_blocks(filtered_content)

        if len(filtered_content) > 200:
            return filtered_content[:200] + " ..."
        else:
            return filtered_content

    def get_avatar(self, obj):
        return obj.author.avatar.url


class DocumentActivitySerializer(serializers.ModelSerializer):
    document = serializers.StringRelatedField()
    document_id = serializers.IntegerField(read_only=True, required=False)
    user_vote = serializers.CharField(read_only=True)

    class Meta:
        model = DocumentActivity
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user_vote = self.context.get("user_vote")
        representation["user_vote"] = user_vote
        return representation


class SearchPublicDocumentSerializer(serializers.Serializer):
    uuid = serializers.UUIDField()
    title = serializers.CharField(required=False)
    content = serializers.SerializerMethodField(required=False)

    def get_content(self, obj):
        filtered_content = filter_markdown_images(obj.content)
        # 使用 filter_markdown_images 函数过滤图片内容

        query = self.context.get("query", None)

        # filtered_content = filter_markdown_code_blocks(filtered_content)

        if query:
            pattern = re.compile(query, re.IGNORECASE)
            match = pattern.search(filtered_content)
            # 如果找到了关键词，返回 -1
            if match:
                query_index = match.start()
                start_index = max(0, query_index - 10)
                end_index = min(len(filtered_content), query_index + len(query) + 10)
                filtered_content = filtered_content[start_index:end_index]

            else:
                if len(filtered_content) > 20:
                    filtered_content = filtered_content[:20]
        else:
            if len(filtered_content) > 20:
                filtered_content = filtered_content[:20]

        return filtered_content

    # def is_valid(self, raise_exception=False):
    #     # 如果对象的 publish 属性为 False，返回 False
    #     if not self.instance.publish:
    #         return False
    #     return super().is_valid(raise_exception=raise_exception)

    # 仅在 publish 属性为 True 时序列化对象
    def to_representation(self, instance):
        if not instance.publish:
            return None
        return super().to_representation(instance)
