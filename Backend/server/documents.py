from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from .models import Category, Channel, Server


@registry.register_document
class ServerDocument(Document):
    uuid = fields.KeywordField()
    owner = fields.ObjectField(properties={"username": fields.TextField(), "avatar": fields.FileField()})

    class Index:
        name = "server"
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = Server
        fields = [
            "name",
            "description",
        ]


@registry.register_document
class ChannelDocument(Document):
    uuid = fields.KeywordField()
    owner = fields.ObjectField(properties={"username": fields.TextField(), "avatar": fields.FileField()})
    admins = fields.ObjectField(properties={"username": fields.TextField(), "avatar": fields.FileField()})
    # members = fields.ObjectField(properties={"username": fields.TextField(), "avatar.url": fields.TextField()})
    server = fields.ObjectField(
        properties={
            "name": fields.TextField(),
            "uuid": fields.KeywordField(),
            "description": fields.TextField(),
        }
    )
    latest_message = fields.ObjectField(
        properties={
            "content": fields.TextField(),
            "timestamp": fields.TimeField(),
            "sender": fields.ObjectField(
                properties={"username": fields.TextField(), "avatar": fields.FileField(store=False)},
            ),
        }
    )

    class Index:
        name = "channel"
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = Channel
        fields = [
            "name",
            "description",
            "created_at",
            "privacy",
            "progress",
        ]
