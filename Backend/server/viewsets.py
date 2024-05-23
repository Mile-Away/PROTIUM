from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Channel, Server
from .serializers import ChannelSerializer, ServerSerializer


# Create your views here.
class ChannelListViewSet(viewsets.ViewSet):
    """
    ChannelListViewSet是一个视图集，用于处理频道列表的请求。

    包含以下功能：
    - 根据查询参数过滤频道列表
    - 根据用户、服务器、频道ID过滤频道列表
    - 可选择是否返回每个频道的成员数量

    """

    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer

    def list(self, request):
        """
        处理GET请求，返回过滤后的频道列表。

        可接受的查询参数：
        - qty: 返回的频道数量
        - by_user: 根据用户过滤频道列表（true表示根据当前用户过滤）
        - by_server: 根据服务器过滤频道列表
        - by_channelid: 根据频道ID过滤频道列表
        - with_num_members: 是否返回每个频道的成员数量（true表示返回）

        返回的数据格式为序列化后的频道列表。

        """
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_server = request.query_params.get("by_server")
        by_channeluuid = request.query_params.get("by_channeluuid")
        with_num_members = request.query_params.get("with_num_members") == "true"

        if by_user:
            user_id = request.user.id
            # 取出当前用户所在的所有 server
            self.queryset = self.queryset.filter(owner=user_id)

        if by_server:
            self.queryset = self.queryset.filter(server=by_server)

        if with_num_members:
            self.queryset = self.queryset.annotate(num_members=Count("members"))

        if qty:
            self.queryset = self.queryset[: int(qty)]

        if by_channeluuid:
            try:
                self.queryset = Channel.objects.filter(uuid=by_channeluuid)
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Channel with ID {by_channeluuid} does not exist.")
            except ValueError:
                raise ValidationError({"error": "Channel ID is invalid."})

        serializer = ChannelSerializer(self.queryset, many=True, context={"num_members": with_num_members})
        return Response(serializer.data)

    def create(self, request):
        """
        处理POST请求，创建一个新的频道。

        请求体中应包含以下字段：
        - name: 频道名称
        - description: 频道描述
        - server: 频道所属服务器的ID

        返回创建的频道的序列化数据。

        """
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Authentication failed."}, status=status.HTTP_401_UNAUTHORIZED)

        server_uuid = request.data.get("server")

        if not server_uuid:
            return Response({"error": "Server ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        server = Server.objects.get(uuid=server_uuid)

        if not server:
            return Response({"error": "Server not found."}, status=status.HTTP_404_NOT_FOUND)

        name = request.data.get("name")

        channel = Channel.objects.filter(name=name, server=server)

        if channel.exists():
            return Response({"error": "Channel Name already exists."}, status=status.HTTP_409_CONFLICT)

        serializer = ChannelSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(owner=user, admins=[user, server.owner], server=server)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=400)

    # Create 要求用户登陆
    # create.permission_classes = [IsAuthenticated]


class ServerListViewSet(viewsets.ViewSet):
    """
    ViewSet for retrieving a list of servers based on various filters.

    Available query parameters:
    - `category`: Filter servers by category name (case-insensitive).
    - `qty`: Limit the number of servers returned.
    - `by_user`: Filter servers by the current user.
    - `by_serverid`: Filter servers by server ID.
    - `with_num_members`: Include the number of members in each server.

    Example usage:
    ```
    GET server/?category=gaming&qty=10&by_user=true&with_num_members=true
    ```

    Returns a list of servers based on the specified filters.
    """

    # FIXME: queryset = Server.objects.all()  # 不要直接修改 self.queryset, 会带来缓存问题
    serializer_class = ServerSerializer

    def get_queryset(self):
        queryset = Server.objects.all()

        return queryset

    def list(self, request):

        queryset = self.get_queryset()
        named = request.query_params.get("named") == "true"
        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_serverid = request.query_params.get("by_serverid")
        by_server_name = request.query_params.get("by_server_name")
        with_num_members = request.query_params.get("with_num_members") == "true"

        if category:
            queryset = queryset.filter(category__name__iexact=category)  # 根据名称，iexact 表示不区分大小写的精确查找
            # self.queryset = Server.objects.filter(category=category)  # 根据序号

        if by_user:
            user_id = request.user.id
            # 取出当前用户所在的所有 server
            queryset = queryset.filter(members__id=user_id)

        if with_num_members:
            queryset = queryset.annotate(num_members=Count("members"))

        if qty:
            queryset = queryset[: int(qty)]

        if by_serverid:
            try:
                queryset = queryset.filter(uuid=by_serverid)
                if not queryset.exists():
                    raise ValidationError(detail=f"Server with ID {by_serverid} does not exist.")
            except ValueError:
                raise ValidationError({"error": "Server ID is invalid."})

        if by_server_name:
            try:
                queryset = queryset.filter(name=by_server_name)
                if not queryset.exists():
                    raise ValidationError(detail=f"Server with name {by_server_name} does not exist.")
            except ValueError:
                raise ValidationError({"error": "Server name is invalid."})
        if named:
            serializer = ServerSerializer(queryset, named=True, many=True, context={"num_members": with_num_members})
            return Response(serializer.data)

        serializer = ServerSerializer(queryset, many=True, context={"num_members": with_num_members})

        return Response(serializer.data)
