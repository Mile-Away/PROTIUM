# DeepModeling Web

## 启动项目

### 后端

0. 依赖：

`python >= 3.12.2`

1. 安装

```bash
pip install -r requirements.txt
```

2. 启动

```bash
uvicorn backend.asgi:application --port 8000 --log-level debug --reload
```

#### 后端需要依赖的环境变量（不包含在仓库中）

```bash
- .env
```

### 前端

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

#### 前端需要依赖的环境变量（不包含在仓库中）

```bash
- .env
- next-env.d.ts
- src/config.ts
- @brand
- public/@brand
```

## 笔记

一个 Handle 同一时间只能连接一条 Edge，当一个已连接的 handle 需要连接第二个 Edge 时，之前的连接会被取消。