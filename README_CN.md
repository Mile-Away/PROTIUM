# PROTIUM

> [查看英文文档 (Read English Readme) ->](./README.md)

PROTIUM 是为科学研究人员设计的可视化工作流 App/Web App。

## 特性

- **直观界面:** 用户友好的设计，便于导航和工作流管理。
- **数据安全:** 本地部署确保所有数据存储在你的机器上，不进行网络通信。
- **灵活部署:** 提供网页访问和使用 Docker 进行本地部署的选择。

## 快速开始

Protium 提供以下三种访问方式：

1. Web
2. 本地部署
    - 使用 Docker 部署
    - 使用源码部署（暂不支持）

### 1. Web

推荐访问 [Protium 网站](https://protium.space) 立即开始。有关网站的任何使用帮助，请参阅 [Protium Docs](https://docs.protium.space/workflow)。

### 2. 本地部署

本地部署为离线版本，所有数据将保存在你的本地，不发生网络通信。

#### 1. 使用 Docker 部署【推荐】

在开始之前，请确保你已经安装了 Docker 软件：

- [Docker](https://docs.docker.com/get-docker/)

Docker 安装完毕后，执行以下命令一键部署（访问 Docker Hub 拉取镜像需要科学上网）：

```bash
curl -O https://protium.space/downloads/deploy.sh && chmod +x deploy.sh && ./deploy.sh
```

以上脚本将新建一个 PROTIUM 文件夹并启动服务。

启动服务前你需要配置环境变量。PROTIUM 文件夹下提供了示例 `.env` 环境变量文件便于一键启动服务，如有需要可自行修改。

#### 2. 使用源码部署

暂不支持。

## 许可证

此项目使用 Apache 2.0 许可证。有关更多详情，请参阅 [LICENSE](./LICENSE) 文件。
