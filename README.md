# PROTIUM

> [Read Chinese Readme (查看中文文档) ->]("#")

PROTIUM 是为科学研究人员设计的可视化工作流。

# Features

# Quick Start

Protium 提供以下三种访问方式：

1. Web
2. 本地部署
    * 使用 Docker 部署
    * 使用源码部署

## 1. Web

随时随地访问 「[Protium 官网](https://protium.space)」立即开始。有关网站的任何使用帮助，请参阅：[Protium Docs](https://docs.protium.spoace/workflow)

## 2. 本地部署

本地部署的为离线版本，所有数据将保存在你的本地，不与 Protium 发生通信。

1. 使用 Docker 部署【推荐】

执行以下脚本一键部署 (该脚本仅涉及 Docker 镜像拉取与启动)

* Windows

打开 PowerShell 或 CMD，运行以下命令：

```powershell
curl -O https://raw.githubusercontent.com/mile-away/protium/main/deploy.sh
bash deploy.sh
```

* Linux 和 macOS

打开终端，运行以下命令：

```bash
curl -O https://raw.githubusercontent.com/mile-away/protium/main/deploy.sh
chmod +x deploy.sh
bash deploy.sh
```