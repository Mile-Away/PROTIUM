from abc import ABC, abstractmethod
from typing import Union

from django.http import Http404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Channel, Server
from .serializer import ChannelSerializer, ServerSerializer


class ChannelDetailAPIView(APIView):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, uuid):
        try:
            editor = self.request.user
            return Channel.objects.get(uuid=uuid, admins=editor)
        except Channel.DoesNotExist:
            raise Http404("Document does not exist.")

    def get(self, request, uuid):
        channel = self.get_object(uuid)
        serializer = ChannelSerializer(channel)
        return Response(serializer.data)

    def put(self, request, uuid):
        print(request.data)
        channel = self.get_object(uuid)
        serializer = ChannelSerializer(channel, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServerDetailAPIView(APIView, ABC):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    permission_classes = [IsAuthenticated]

    @abstractmethod
    def get_object(self, name: str) -> Union[Server, Http404]:
        pass

    def get(
        self,
        request,
        name: str,
    ) -> Response:
        server = self.get_object(name)
        serializer = self.serializer_class(server)
        return Response(serializer.data)

    def put(self, request, name):

        print(request.data)

        server = self.get_object(name)
        serializer = self.serializer_class(server, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        print(serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ServerAdminsDetailAPIView(ServerDetailAPIView):
    def get_object(self, name: str) -> Union[Server, Http404]:
        user = self.request.user
        try:
            server = Server.objects.get(name=name, admins=user)
            return server
        except Server.DoesNotExist:
            raise Http404("Server does not exist.")
