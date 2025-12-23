# CI/CD 部署配置

本目录包含容器化部署所需的所有配置文件。

## 文件说明

- **Dockerfile** - 多阶段构建的 Docker 镜像构建文件
- **entrypoint.sh** - 容器启动脚本，用于动态配置 API 代理
- **nginx.conf.template** - Nginx 配置模板（支持环境变量替换）

## 使用方法

### 1. 构建镜像

```bash
# 在项目根目录执行
docker build -f ci/Dockerfile -t oilgas-frontend:latest .
```

### 2. 运行容器

#### 使用 Docker Run：

```bash
# 必须设置 API_URL 环境变量
docker run -d \
  -p 8080:8080 \
  -e API_URL=http://backend-service:8080 \
  --name frontend \
  oilgas-frontend:latest
```

### 3. 环境变量配置

**必需环境变量：**

- `API_URL` - 后端 API 地址，例如：`http://backend:8080` 或 `https://api.example.com`

**示例：**

```bash
# 开发环境
export API_URL=http://localhost:8081

# 生产环境
export API_URL=https://api.oilgas.com

# 测试环境
export API_URL=http://test-backend:8080
```

## 部署示例

### Kubernetes 部署（示例）

```yaml
# 如果需要 Kubernetes，可以创建 ci/k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: oilgas-frontend:latest
          ports:
            - containerPort: 8080
          env:
            - name: API_URL
              value: 'http://backend-service:8080'
          readinessProbe:
            httpGet:
              path: /
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
```

### CI/CD 集成

#### GitHub Actions 示例（建议创建 `.github/workflows/deploy.yml`）：

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build -f ci/Dockerfile -t oilgas-frontend:${{ github.sha }} .

      - name: Deploy to server
        run: |
          # 推送到镜像仓库并部署
          docker tag oilgas-frontend:${{ github.sha }} your-registry/oilgas-frontend:latest
          docker push your-registry/oilgas-frontend:latest

          # 触发部署（SSH 到服务器或使用 kubectl）
          # ssh user@server "docker run -d -p 8080:8080 -e API_URL=... oilgas-frontend:latest"
```

## 故障排查

### 1. 容器启动失败

```bash
# 查看日志
docker logs frontend

# 常见错误：未设置 API_URL
# 解决：确保设置了 -e API_URL=...
```

### 2. API 代理不工作

```bash
# 进入容器检查配置
docker exec -it frontend sh
cat /etc/nginx/conf.d/default.conf

# 测试后端连接
wget http://backend:8080/api/health
```

### 3. 权限问题

```bash
# 确保 entrypoint 有执行权限
chmod +x ci/entrypoint.sh
```

## 最佳实践

1. **镜像标签**：使用语义化版本号或 Git SHA

   ```bash
   docker build -t oilgas-frontend:v1.2.3 .
   docker build -t oilgas-frontend:${GIT_SHA} .
   ```

2. **健康检查**：生产环境启用健康检查

   ```yaml
   healthcheck:
     test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost:8080/']
     interval: 30s
     timeout: 10s
     retries: 3
   ```

3. **资源限制**：生产环境设置资源限制

   ```yaml
   deploy:
     resources:
       limits:
         memory: 512M
         cpus: '0.5'
   ```

4. **日志收集**：配置集中式日志
   ```bash
   docker run ... --log-driver=fluentd --log-opt fluentd-address=localhost:24224
   ```

## 目录结构

```
ci/
├── Dockerfile              # 主构建文件
├── entrypoint.sh           # 启动脚本
├── nginx.conf.template     # Nginx 配置模板
└── README.md              # 本文件
```

## 相关文档

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Nginx 配置文档](https://nginx.org/en/docs/)
