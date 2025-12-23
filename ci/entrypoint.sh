#!/bin/sh
set -e

# 检查必需的环境变量
if [ -z "$API_URL" ]; then
    echo "错误：必须设置 API_URL 环境变量（例如：http://backend:8080）"
    exit 1
fi

# 替换 Nginx 配置中的占位符
if [ -f /etc/nginx/conf.d/default.conf.template ]; then
    envsubst '\$API_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
    echo "Nginx 配置已更新：API 代理指向 ${API_URL}"
else
    echo "错误：未找到配置模板文件 /etc/nginx/conf.d/default.conf.template"
    exit 1
fi

# 启动 Nginx
exec "$@"
