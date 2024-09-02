# PROTIUM

> [Read Chinese Readme (查看中文文档) ->]("./README_CN.md")

PROTIUM 是为科学研究人员设计的可视化工作流。

## Features

## Quick Start

Protium 提供以下三种访问方式：

1. Web
2. 本地部署
    * 使用 Docker 部署
    * 使用源码部署

### 1. Web

推荐访问 「[Protium 网站](https://protium.space)」立即开始。有关网站的任何使用帮助，请参阅：[Protium Docs](https://docs.protium.spoace/workflow)

### 2. 本地部署

本地部署的为离线版本，所有数据将保存在你的本地，不与 Protium 发生通信。

1. 使用 Docker 部署【推荐】

在开始之前，请确保你的系统已经安装了以下软件：

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

Docker 安装完毕后，执行以下命令拉取镜像并执行

```bash
mkdir PROTIUM && cd PROTIUM
docker pull ghcr.io/mile-away/protium/backend:latest
docker pull ghcr.io/mile-away/protium/frontend:latest
docker pull ghcr.io/mile-away/protium/workflow:latest
docker pull ghcr.io/mile-away/protium/docfront:latest
curl -O https://raw.githubusercontent.com/Mile-Away/PROTIUM/main/.env.eaxmple
mv .env.example .env
docker compose up -d
```

启动服务前你需要配置环境变量，`.env.example` 文件中提供了默认的环境变量便于一键启动服务，如有需要可自行修改。

创建一个新文件夹，在根目录下创建以下两个文件：

- .env
- docker-compose.yml

文件内容可以直接

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for more details.


