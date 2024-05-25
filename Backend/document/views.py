from django.http import Http404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Attachment, Document, DocumentActivity, DocumentActivityUser
from .schema import doc_detail_schema, doc_list_schema
from .serializer import (
    AttachmentSerializer,
    DocumentActivitySerializer,
    DocumentListSerializer,
    DocumentSerializer,
    PublicArticleSerializer,
)


class TagViewset(viewsets.ModelViewSet):
    pass


class DocumentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 20
    page_query_param = "page"


class DocumentListViewSet(viewsets.ModelViewSet):

    serializer_class = DocumentSerializer
    pagination_class = DocumentPagination

    def get_queryset(self):
        queryset = Document.objects.all().order_by("-updated_at")
        return queryset

    def get_permissions(self):
        if self.request.query_params.get("is_public") == "true":
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    """
    即使携带多个参数 is_public = true&by_documentid = 1，此时的权限会被设为 AllowAny
    但是在 list 方法中，会根据 is_public 的值来进行不同的查询，如果 is_public = true，只会返回所有公开文档
    by_documentid 参数会被忽略，所以不会有安全问题。
    """

    @doc_list_schema
    def list(self, request, *args, **kwargs):

        author = request.user
        by_documentid = request.query_params.get("by_documentid")
        is_public = request.query_params.get("is_public") == "true"

        if is_public:
            queryset = self.get_queryset().filter(publish=True).exclude(title="", content=None)

            # 使用分页器分页数据
            paginated_querset = self.paginate_queryset(queryset)

            # 使用 PublicArticleSerializer 来序列化数据
            serializer = PublicArticleSerializer(paginated_querset, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            # 获取当前用户的所有文档
            queryset = self.get_queryset().filter(author=author).exclude(title="", content=None)

            if by_documentid:
                try:
                    queryset = self.get_queryset().filter(id=by_documentid)
                    if not queryset.exists():
                        return Response(
                            {"error": "Document not found"},
                            status=status.HTTP_404_NOT_FOUND,
                        )
                except ValueError:
                    return Response(
                        {"error": "Invalid document ID"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                serializer = DocumentSerializer(queryset, many=True)
                return Response(serializer.data)

            serializer = DocumentListSerializer(queryset, many=True)
            return Response(serializer.data)

    def create(self, request):
        # 定义 create 方法，接受 post 请求，创建新的文档
        # create 方法会接受 post 请求，但是 post 方法不会接受 post 请求，绝。

        author = request.user
        serializer = DocumentSerializer(data=request.data)

        # 先清理 title = “” 并且内容为空的文档
        Document.objects.filter(title="", content=None).delete()

        if serializer.is_valid():

            serializer.save(author=author)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        errors = serializer.errors

        if "author" in errors and "non_field_errors" not in errors:
            return Response(
                {"error": "Author is not existed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        print("doc create error:", errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicArticleDetailView(APIView):
    queryset = Document.objects.all().filter(publish=True)
    serializer_class = PublicArticleSerializer
    permission_classes = [AllowAny]

    def get_object(self, uuid):
        try:
            article = Document.objects.get(uuid=uuid)
            return article
        except Document.DoesNotExist:
            raise Http404("Document does not exist.")

    def get(self, request, uuid, format=None):
        article = self.get_object(uuid)
        # 记录文档的访问次数
        document_activity, created = DocumentActivity.objects.get_or_create(document=article)
        document_activity.view += 1
        document_activity.save()
        serializer = DocumentSerializer(article)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DocumentActivityView(APIView):
    queryset = DocumentActivity.objects.all()
    permission_classes = [AllowAny]

    def get_object(self, uuid):
        try:
            document = Document.objects.get(uuid=uuid)
            document_activity, created = DocumentActivity.objects.get_or_create(document=document)
            return document_activity
        except Document.DoesNotExist:
            raise Http404("Document does not exist.")

    def get_view(self, request, uuid):
        document = self.get_object(uuid)
        serializer = DocumentActivitySerializer(document)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, uuid, format=None):
        user = request.user

        if not user.is_authenticated:
            return self.get_view(request, uuid)

        document_activity = self.get_object(uuid)

        try:
            document_activity_user = DocumentActivityUser.objects.get(activity=document_activity, user=user)
            user_vote = document_activity_user.vote
        except DocumentActivityUser.DoesNotExist:
            user_vote = None

        serializer = DocumentActivitySerializer(document_activity, context={"user_vote": user_vote})
        serializer.data.update({"user_vote": user_vote})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, format=None):
        document_activity = self.get_object(pk)
        serializer = DocumentActivitySerializer(document_activity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, pk, format=None):
        document_activity = self.get_object(pk)
        vote = request.data.get("vote")
        if vote not in ["agree", "disagree"]:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            document_activity_instance, created = DocumentActivityUser.objects.get_or_create(
                activity=document_activity, user=request.user, action=action
            )
            if not created:
                document_activity_instance.vote = vote
        except DocumentActivityUser.ExistError:
            return Response({"error": "You have already voted for this document."}, status=status.HTTP_400_BAD_REQUEST)

        if vote == "agree":
            document_activity.agree += 1
        else:
            document_activity.disagree += 1
        document_activity.save()

        serializer = DocumentActivitySerializer(document_activity)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DocumentDetailView(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, uuid):
        try:
            author = self.request.user
            return Document.objects.get(uuid=uuid, author=author)
        except Document.DoesNotExist:
            raise Http404("Document does not exist.")

    def get(self, request, uuid, format=None):

        document = self.get_object(uuid)

        serializer = DocumentSerializer(document)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @doc_detail_schema
    def put(self, request, uuid):
        document = self.get_object(uuid)
        serializer = DocumentSerializer(document, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, uuid, format=None):
        document = self.get_object(uuid)
        document.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class AttachmentViewset(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]
    # parser_classes 处理文件上传
    parser_classes = [MultiPartParser]

    def create(self, request, pk=None):
        uuid = request.query_params.get("uuid")
        document = Document.objects.get(uuid=uuid)
        # authur = request.user
        # data = request.data.copy()
        # data.update({"author": authur.username})
        # data.update({"document": document.id})
        serializer = AttachmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(document=document)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AttachmentDetailView(APIView):

    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    # def post(self, request, pk=None):

    #     document = Document.objects.get(pk=pk)

    #     print(request.data)
    #     authur = request.user
    #     print(authur)
    #     data = request.data.copy()
    #     # data.update({"author": authur.username})
    #     data.update({"document": document.title})
    #     return self.create(request, data=data)
