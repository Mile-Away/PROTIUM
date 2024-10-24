# 使用官方 Miniconda 镜像作为基础镜像
FROM continuumio/miniconda3:latest

# 设置工作目录
WORKDIR /app

# Install netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

# 复制依赖文件到工作目录
COPY requirements.txt /app/requirements.txt

# 安装 psycopg2 和项目的 Python 依赖
RUN pip install --upgrade pip && pip install -r requirements.txt && conda install psycopg2 -y

# 复制项目文件到工作目录
COPY . /app

# 暴露端口
EXPOSE 8000

# 运行 Django 服务器
CMD ["/app/entrypoint.sh"]

LABEL org.opencontainers.image.source=https://github.com/mile-away/protium


# all pip dependencies
# pip install django gunicorn uvicorn[standard] python-dotenv channels elasticsearch djangorestframework drf-spectacular django-cors-headers djangorestframework-simplejwt django-elasticsearch-dsl pillow aiofiles whitenoise pydflow
# all conda dependencies
# conda install psycopg2