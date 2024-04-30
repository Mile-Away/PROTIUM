import abc

from document.documents import PublicDocumentModelDocument
from document.models import Document as DocumentModel
from document.serializer import DocumentSerializer, SearchPublicDocumentSerializer
from elasticsearch_dsl import MultiSearch, Q
from rest_framework import serializers, status
from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from server.documents import ChannelDocument
from server.models import Channel
from server.serializer import SearchChannelSerializer

from .serializers import GlobalSearchSerializer


class BasePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100
    page_query_param = "page"


class LimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    limit_query_param = "limit"
    offset_query_param = "offset"
    max_limit = 100


class PaginatedElasticSearchAPIView(APIView, LimitOffsetPagination):
    serializer_class = None
    document_class = None
    permission_classes = [AllowAny]

    @abc.abstractmethod
    def generate_q_expression(self, query):
        """This method should be overridden
        and return a Q() expression."""

    def get(self, request, query):
        try:
            q = self.generate_q_expression(query)
            search = self.document_class.search().query(q)

            # response = search.execute()
            response = search.to_queryset()

            results = self.paginate_queryset(response, request, view=self)

            serializer = self.serializer_class(results, many=True, context={"query": query})

            return self.get_paginated_response(serializer.data)
        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)


class SearchChannelView(PaginatedElasticSearchAPIView):
    serializer_class = SearchChannelSerializer
    document_class = ChannelDocument
    permission_classes = [AllowAny]

    def generate_q_expression(self, query):
        return Q("multi_match", type="phrase_prefix", query=query, fields=["name", "description"])


class SearchDocumentView(PaginatedElasticSearchAPIView):
    serializer_class = SearchPublicDocumentSerializer
    document_class = PublicDocumentModelDocument
    permission_classes = [AllowAny]

    def generate_q_expression(self, query):
        return Q(
            "multi_match",
            type="phrase_prefix",
            query=query,
            fields=["title", "content"],
        )


class SearchGlobalView(APIView, LimitOffsetPagination):
    serializer_class = GlobalSearchSerializer
    document_classes = [PublicDocumentModelDocument, ChannelDocument]

    def generate_q_expression(self, query):
        query_exp = Q(
            "multi_match", type="phrase_prefix", query=query, fields=["name", "description", "title", "content"]
        )
        # filter_exp = Q("term", publish=True)  # 过滤掉 publish=false 的文档
        # combined_exp = Q("bool", must=query_exp, filter=filter_exp)  # 结合两个 Q 对象
        return query_exp

    def get(self, request, query):
        try:
            q = self.generate_q_expression(query)
            ms = MultiSearch(using="default")

            for document_class in self.document_classes:
                search = document_class.search().query(q)
                ms = ms.add(search)

            responses = [s.to_queryset() for s in ms]

            serializer = self.serializer_class(
                {
                    "documents": self.paginate_queryset(responses[0], request, view=self),
                    "channels": self.paginate_queryset(responses[1], request, view=self),
                },
                context={"query": query},
            )

            return Response(serializer.data, status=status.HTTP_200_OK)

            """
            也可以使用 ms.execute() 方法，但是这样会导致两个查询串行执行，而不是并行执行
            这样获得的 results 中包含了两个查询的结果，其格式可见 elasticsearch_example.json 文档
            代码如下：
            """

            # responses = ms.execute()
            # results = [hit.to_dict() for hit in responses]
            # return Response(results, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)
