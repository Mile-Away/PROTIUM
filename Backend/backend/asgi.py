import os


from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

django_asgi_app = get_asgi_application()

"""
initialize Django ASGI application early to ensure the AppRegistry 
is populated before importing code that may import ORM models.
"""

# MUST AFTER INIT django_asgi_app
from . import urls  # noqa isort:skip
from webchat.middleware import JWTAuthMiddleWare  # noqa isort:skip

# ProtocolTypeRouter 用来指定不同的协议对应不同的处理方式， http/websocket

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": JWTAuthMiddleWare(
            URLRouter(urls.websocket_urlpatterns),
        ),
        # Just HTTP for now. (We can add other protocols later.)
    }
)
