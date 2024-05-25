from rest_framework import serializers

from .models import GithubAsset, GithubRelease, GithubUser


class GithubUserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = GithubUser
        fields = "__all__"

    # def validate(self, attrs):
    #     # super().validate(attrs)
    #     print("attrs", attrs)
    #     return attrs

    def create(self, validated_data):

        instance = GithubUser.objects.update_or_create(id=validated_data.pop("id"), defaults=validated_data)
        return instance


class GithubAssetSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    release = serializers.StringRelatedField(read_only=True)
    uploader = GithubUserSerializer()

    class Meta:
        model = GithubAsset
        fields = "__all__"


class GithubReleaseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    server = serializers.StringRelatedField(read_only=True)
    assets = GithubAssetSerializer(many=True)
    author = GithubUserSerializer()

    class Meta:
        model = GithubRelease
        fields = "__all__"

    def create(self, validated_data):

        id = validated_data.pop("id", None)

        author = validated_data.pop("author", None)
        author_id = author.pop("id")
        Author, created = GithubUser.objects.update_or_create(id=author_id, defaults=author)

        assets = validated_data.pop("assets", [])

        instance, created = GithubRelease.objects.update_or_create(id=id, author=Author, defaults=validated_data)

        for asset in assets:
            asset_id = asset.pop("id")
            uploader = asset.pop("uploader")
            uploader_id = uploader.pop("id")
            Uploader, created = GithubUser.objects.update_or_create(id=uploader_id, defaults=uploader)
            Assets, created = GithubAsset.objects.update_or_create(
                id=asset_id, uploader=Uploader, release=instance, defaults=asset
            )

        return instance
