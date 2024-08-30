#!/bin/bash

# 检测操作系统
OS=$(uname)
if [[ "$OS" == "Linux" ]]; then
    OS_TYPE="linux"
elif [[ "$OS" == "Darwin" ]]; then
    OS_TYPE="macos"
elif [[ "$OS" =~ MINGW64_NT* || "$OS" =~ MSYS_NT* || "$OS" =~ CYGWIN_NT* ]]; then
    OS_TYPE="windows"
else
    echo "不支持的操作系统: $OS"
    exit 1
fi

echo "操作系统: $OS_TYPE"

# # 针对不同操作系统的安装步骤
# install_docker() {
#     if [[ "$OS_TYPE" == "linux" ]]; then
#         if ! command -v docker &> /dev/null; then
#             echo "Docker 未安装，正在安装 Docker..."
#             sudo apt-get update
#             sudo apt-get install -y \
#                 ca-certificates \
#                 curl \
#                 gnupg \
#                 lsb-release
#             sudo mkdir -p /etc/apt/keyrings
#             curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
#             echo \
#               "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
#               $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
#             sudo apt-get update
#             sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
#             sudo systemctl start docker
#             sudo systemctl enable docker
#             echo "Docker 安装完成。"
#         else
#             echo "Docker 已安装。"
#         fi
#     elif [[ "$OS_TYPE" == "macos" || "$OS_TYPE" == "windows" ]]; then
#         echo "请手动安装 Docker Desktop: https://www.docker.com/products/docker-desktop"
#         exit 1
#     fi
# }

# install_docker_compose() {
#     if [[ "$OS_TYPE" == "linux" ]]; then
#         if ! command -v docker-compose &> /dev/null; then
#             echo "Docker Compose 未安装，正在安装 Docker Compose..."
#             sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
#             sudo chmod +x /usr/local/bin/docker-compose
#             echo "Docker Compose 安装完成。"
#         else
#             echo "Docker Compose 已安装。"
#         fi
#     elif [[ "$OS_TYPE" == "macos" || "$OS_TYPE" == "windows" ]]; then
#         echo "请手动安装 Docker Desktop: https://www.docker.com/products/docker-desktop"
#         exit 1
#     fi
# }

# # 调用安装函数
# install_docker
# install_docker_compose

# # 通用部分
# # 下载 .env.example 并重命名为 .env
# if [ ! -f .env ]; then
#     echo ".env 文件不存在，正在下载 .env.example 并重命名为 .env..."
#     curl -O https://raw.githubusercontent.com/your-username/your-repo/main/.env.example
#     mv .env.example .env
#     echo ".env 文件已创建，请编辑 .env 文件并配置环境变量。"
#     exit 1
# else
#     echo ".env 文件已存在。"
# fi

# # 启动服务
# echo "启动服务中..."
# docker compose up -d

# echo "所有服务已启动。"

# # 检查服务状态
# docker compose ps
