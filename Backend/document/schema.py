from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, OpenApiRequest, extend_schema

from .serializer import AttachmentSerializer, DocumentSerializer

doc_list_schema = extend_schema(
    responses=DocumentSerializer(many=True),
    parameters=[
        # OpenApiParameter(
        #     name="by_author",
        #     description="Filter documents by the current user.",
        #     type=OpenApiTypes.INT,
        #     location=OpenApiParameter.QUERY,
        # ),
        OpenApiParameter(
            name="by_documentid",
            description="Filter documents by the document ID.",
            required=False,
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
        ),
        OpenApiParameter(
            name="is_public",
            description="Filter documents by the public status.",
            required=False,
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
        ),
    ],
)


doc_detail_schema = extend_schema(
    request=DocumentSerializer,
    responses=DocumentSerializer(),
    parameters=[
        OpenApiParameter(
            name="title",
            description="The document Title",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
        ),
        OpenApiParameter(
            name="content",
            description="The document Content",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
        ),
    ],
)

article_list_schema = extend_schema()