import ast
import os
import warnings
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv
from elasticsearch import ElasticsearchWarning

warnings.filterwarnings("ignore", category=ElasticsearchWarning)
load_dotenv(override=False)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = ast.literal_eval(os.environ.get("DEBUG", "False"))

if DEBUG:
    ALLOWED_HOSTS = ["*"]
else:
    ALLOWED_HOSTS = ast.literal_eval(os.environ.get("ALLOWED_HOSTS", "[]"))

CSRF_TRUSTED_ORIGINS = ast.literal_eval(os.environ.get("CSRF_TRUSTED_ORIGINS", "[]"))

ILAB_HOST = os.environ.get("ILAB_HOST", "http://172.21.4.200:8000")

# # For Allauth
# SITE_ID = 1
# AUTHENTICATION_BACKENDS = [
#     # Needed to login by username in Django admin, regardless of `allauth`
#     "django.contrib.auth.backends.ModelBackend",
#     # `allauth` specific authentication methods, such as login by email
#     # "allauth.account.auth_backends.AuthenticationBackend",
# ]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # API
    "rest_framework",
    "drf_spectacular",
    # CORS
    "corsheaders",
    # Social Login
    # "django.contrib.sites",
    # "allauth",
    # "allauth.account",
    # "allauth.socialaccount",
    # "allauth.socialaccount.providers.github",
    # ASGI
    "channels",
    # build Elasticsearch index
    "django_elasticsearch_dsl",
    # Internal
    "accounts.apps.AccountConfig",
    "server.apps.ServerConfig",
    "document.apps.DocumentConfig",
    "search.apps.SearchConfig",
    "webchat.apps.WebchatConfig",
    "workflow.apps.WorkflowConfig",
    "integration.apps.IntegrationConfig",
    "api.apps.ApiConfig",
    "flociety.apps.FlocietyConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS middleware
    "django.middleware.common.CommonMiddleware",
    # "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # Add the account middleware:
    # "allauth.account.middleware.AccountMiddleware",
]

if os.environ.get("CSRF_TRUSTED_ORIGINS"):
    MIDDLEWARE.insert(3, "django.middleware.csrf.CsrfViewMiddleware")

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                # `allauth` needs this from django
                # "django.template.context_processors.request",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"
ASGI_APPLICATION = "backend.asgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": os.environ.get("DATABASE_ENGINE", "django.db.backends.postgresql"),  # 数据库引擎
        "NAME": os.environ.get("DATABASE_NAME"),  # 创建的数据库名
        "USER": os.environ.get("DATABASE_USER"),  # 用户名
        "PASSWORD": os.environ.get("DATABASE_PASSWORD"),  # 密码
        "HOST": os.environ.get("DATABASE_HOST"),
        "PORT": os.environ.get("DATABASE_PORT"),
        # "OPTIONS": {
        #     "charset": "utf8mb4",
        # },
    }
}


# Elasticsearch
# https://django-elasticsearch-dsl.readthedocs.io/en/latest/settings.html


ELASTICSEARCH_DSL = {
    "default": {
        "hosts": os.environ.get("ELASTICSEARCH_HOST"),
        "http_auth": (os.environ.get("ELASTICSEARCH_USERNAME"), os.environ.get("ELASTICSEARCH_PASSWORD")),
        "ca_certs": os.environ.get("ELASTICSEARCH_CA_CERTS"),
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Shanghai"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATIC_URL = "static/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "media/"
WORKFLOW_ROOT = os.path.join(MEDIA_ROOT, "workflow")
WORKFLOW_URL = "workflow/"
LIBRARY_ROOT = os.path.join(BASE_DIR, "library")
LIBRARY_URL = "library/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Custom User Model
AUTH_USER_MODEL = "accounts.User"

SOCIALACCOUNT_PROVIDERS = {
    "github": {
        # For each OAuth based provider, either add a ``SocialApp``
        # (``socialaccount`` app) containing the required client
        # credentials, or list them here:
        "APP": {
            "client_id": os.environ.get("GITHUB_AUTH_ID"),
            "secret": os.environ.get("GITHUB_AUTH_SECRET"),
            "key": "",
        }
    }
}

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_AUTHENTICATION_CLASSES": (
        # "rest_framework.authentication.SessionAuthentication",
        "accounts.authentication.APITokenAuthentication",  # Add this line
        "accounts.authentication.JWTCookieAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PERMISSION_CLASSES": [
        # "rest_framework.permissions.IsAuthenticated",
    ],
    # "DEFAULT_RENDERER_CLASSES": [
    #     "backend.renders.EmptyBrowsableAPIRenderer",
    #     "rest_framework.renderers.JSONRenderer",
    # ],
}

if not DEBUG:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [
        "backend.renders.EmptyBrowsableAPIRenderer",
        "rest_framework.renderers.JSONRenderer",
    ]
else:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ]

SPECTACULAR_SETTINGS = {
    "TITLE": "backend API",
    "DESCRIPTION": "API for Protium",
    "VERSION": "1.0.0",
    # "SCHEMA_PATH_PREFIX": "/api/v1",
    "SERVE_INCLUDE_SCHEMA": True,
    # "SERVE_PUBLIC": False,
    # "COMPONENT_SPLIT_REQUEST": True,
    # "COMPONENT_SPLIT_RESPONSE": True,
    # "TAGS": [
    #     {"name": "account", "description": "Account related endpoints"},
    #     {"name": "server", "description": "Server related endpoints"},
    # ],
}


# Email settings
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.feishu.cn")
EMAIL_PORT = 465
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "noreply@yourdomain.com")  # 邮箱
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "your-email-password")  # 邮箱授权码
EMAIL_USE_TLS = False
EMAIL_USE_SSL = True
EMAIL_SSL_CERTFILE = None
EMAIL_SSL_KEYFILE = None
EMAIL_FROM = "Protium"  # os.environ.get("EMAIL_HOST_USER")


CORS_ALLOW_ALL_ORIGINS = ast.literal_eval(os.environ.get("CORS_ALLOW_ALL_ORIGINS", "False"))
CORS_ORIGIN_WHITELIST = ast.literal_eval(os.environ.get("CORS_ORIGIN_WHITELIST", "[]"))
CORS_ALLOW_CREDENTIALS = True  # 允许携带 cookie

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=ast.literal_eval(os.environ.get("ACCESS_TOKEN_LIFETIME", "30"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=ast.literal_eval(os.environ.get("REFRESH_TOKEN_LIFETIME", "14"))),
    "REFRESH_TOKEN_COOKIE_NAME": "refresh_token",
    "ACCESS_TOKEN_COOKIE_NAME": "access_token",
    "JWT_COOKIE_SAMESITE": os.environ.get("JWT_COOKIE_SAMESITE", "Lax"),
    "JWT_COOKIE_SECURE": ast.literal_eval(os.environ.get("JWT_COOKIE_SECURE", "True")),
    "JWT_COOKIE_DOMAIN": ast.literal_eval(os.environ.get("JWT_COOKIE_DOMAIN", "None")),
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}
