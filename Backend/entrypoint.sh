#!/bin/sh

# 运行数据库迁移
echo "运行数据库迁移..."
python manage.py migrate

# 恢复数据
echo "恢复数据..."
python manage.py restore

# 检查环境变量决定启动开发服务器还是生产服务器
if [ "$ENV" = "development" ]; then
    echo "Starting development server..."
    uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 --log-level debug --reload
else
    echo "Starting production server..."
    # 获取可用的 CPU 核心数量
    WORKERS=$(nproc)
    gunicorn \
        --access-logfile - \
        -k uvicorn.workers.UvicornWorker \
        --workers $WORKERS \
        --bind 0.0.0.0:8000 \
        backend.asgi:application
fi
