# 第一阶段：构建阶段
FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./
RUN yarn install --production

COPY .next/ .next/
COPY public/ public/
COPY mdx/ mdx/
COPY next.config.mjs .

# 第二阶段：生产镜像
FROM node:slim

WORKDIR /app

# 只复制需要的文件和依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/mdx ./mdx
COPY --from=builder /app/next.config.mjs .

# 复制 package.json 和 yarn.lock
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

EXPOSE 3003

CMD ["yarn", "start"]

LABEL org.opencontainers.image.source=https://github.com/mile-away/protium
