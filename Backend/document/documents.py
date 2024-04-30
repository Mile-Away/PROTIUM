from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from .models import Document as DocumentModel


@registry.register_document
class PublicDocumentModelDocument(Document):
    author = fields.ObjectField(properties={"username": fields.TextField(), "avatar": fields.FileField()})
    tags = fields.ObjectField(properties={"name": fields.TextField()})
    publish = fields.BooleanField()

    class Index:
        name = "document"
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = DocumentModel
        fields = [
            "title",
            "content",
        ]

    def get_queryset(self):
        return super().get_queryset().filter(publish=True)
