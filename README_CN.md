# PROTIUM Web

## 启动项目

### 后端 Backend

0. 依赖：

`python >= 3.12.3`

1. 安装

```bash
pip install -r requirements.txt
```

2. 启动

```bash
uvicorn backend.asgi:application --port 8000 --log-level debug --reload
```

#### 环境变量（不包含在仓库中）

```bash
- .env
```

### 前端 Fronted/工作流 PROTIUM/文档 DocFront

0. 依赖

`node >= 20.12.1`

1. 安装

```bash
cd Fronted
npm install
```

2. 启动

```bash
npm run dev
```

#### 环境变量（不包含在仓库中）

```bash
- .env
- next-env.d.ts
- src/config.ts
```

## 其它需要依赖的项目

### `docker`

### `elasticSearch`

### `PostgreSQL`

### `redis`

### `celery`

1. 安装

```bash
pip install redis celery django-celery-beat django-celery-results
```

2. 运行

1. 启动 Celery worker 服务:

```bash
# execute path: @/Backend/

celery -A backend worker --loglevel=info
```

2. 启动 Celery beat 服务:

```bash
# execute path: @/Backend/

celery -A backend beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

## 本项目核心依赖的项目

前端：

* TailwindCSS
* Next.js
* react-redux
* tiptap
* ReactFlow
* dnd-kit
* react-json-schema
* react-use-websocket

后端

* Django
* django-rest-framework
* django-simple-jwt
* django-celery-beat, django-celery-results 