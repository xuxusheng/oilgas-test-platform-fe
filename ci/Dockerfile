# 多阶段构建：构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10

# 复制依赖管理文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（使用 frozen lockfile 确保可重现性）
RUN pnpm install --frozen-lockfile

# 复制所有源代码
COPY . .

# 运行代码检查和构建
RUN pnpm lint && \
    pnpm typecheck && \
    pnpm build

# 生产阶段：Nginx 服务器
FROM nginx:alpine AS production

# 安装 envsubst 工具（用于环境变量替换）
RUN apk add --no-cache bash

# 移除默认 nginx 配置
RUN rm -rf /etc/nginx/conf.d/*

# 复制 nginx 配置模板
COPY ci/nginx.conf.template /etc/nginx/conf.d/default.conf.template

# 复制 entrypoint 脚本
COPY ci/entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 暴露端口
EXPOSE 8080

# 使用 entrypoint 启动
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]