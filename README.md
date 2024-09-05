# PROTIUM

> [Read Chinese Readme (查看中文文档) ->](./README_CN.md)

PROTIUM is a visualization workflow designed for scientific researchers.

## Features

- **Intuitive Interface:** User-friendly design for easy navigation and workflow management.
- **Data Security:** Local deployment ensures all data is stored on your machine with no network communication.
- **Flexible Deployment:** Choose between web access and local deployment using Docker.

## Quick Start

Protium offers the following access methods:

1. Web
2. Local Deployment
    - Using Docker
    - From Source (currently not supported)

### 1. Web

We recommend accessing the [Protium Website](https://protium.space) to get started immediately. For any help regarding the website usage, please refer to the [Protium Docs](https://docs.protium.space/workflow).

### 2. Local Deployment

The local deployment is an offline version where all data will be stored locally with no network communication.

#### 1. Using Docker [Recommended]

Before starting, make sure you have Docker installed:

Please visit the [Docker official website](https://docs.docker.com/get-docker/) to download and install Docker.

Choose the appropriate deployment script based on your geographic location:

* For Users in Mainland China

Mainland China users should use the following script, which utilizes Alibaba Cloud (Aliyun) mirror services to optimize download speeds and overall experience:

```bash
curl -O https://protium.space/downloads/deploy-cn.sh && chmod +x deploy-cn.sh && ./deploy-cn.sh
```

* For International Users

International users should use the following script, which utilizes Docker's official mirror services for optimal performance:

```bash
curl -O https://protium.space/downloads/deploy-en.sh && chmod +x deploy-en.sh && ./deploy-en.sh
```

Before starting the service, you need to configure environment variables. A sample `.env` file is provided in the PROTIUM folder for easy setup, which you can modify as needed.

#### 2. From Source

Currently not supported.

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for more details.