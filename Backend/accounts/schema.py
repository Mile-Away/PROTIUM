from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema

from .serializer import UserSerializer

user_list_schema = extend_schema(
    responses=UserSerializer(many=True),
    parameters=[

    ],
)