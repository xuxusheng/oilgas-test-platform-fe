# GitHub Actions CI 工作流说明

## 概述

本项目使用 GitHub Actions 实现 CI（持续集成）自动化流程，包括代码质量检查、构建验证和 Docker 镜像构建推送。

## 工作流文件

### `ci.yml` - CI 工作流

包含以下功能：

1. **代码质量检查** (`code-quality`)
   - 代码格式化检查 (`pnpm format:check`)
   - ESLint 代码检查 (`pnpm lint`)
   - TypeScript 类型检查 (`pnpm typecheck`)

2. **构建验证** (`build-verify`)
   - 项目构建 (`pnpm build`)
   - 验证构建产物完整性
   - 上传构建产物（可下载用于部署）

3. **开发环境镜像构建** (`build-and-push-dev`)
   - 触发条件：推送到 `develop` 分支
   - 构建 Docker 镜像并推送到镜像仓库
   - 镜像标签：`dev-分支名`、`dev-短SHA`、`dev-latest`

4. **生产环境镜像构建** (`build-and-push-prod`)
   - 触发条件：推送到 `main` 分支
   - 构建生产环境 Docker 镜像
   - 镜像标签：`prod-分支名`、`prod-短SHA`、`prod-latest`、`版本号`

5. **Pull Request 检查** (`pr-check`)
   - 触发条件：创建或更新 PR
   - 完整的代码质量检查和构建验证

## 触发条件

| 分支 | 事件 | 作用 |
|------|------|------|
| `develop` | `push` | 开发环境镜像构建推送 |
| `main` | `push` | 生产环境镜像构建推送 |
| 任何分支 | `pull_request` | PR 检查（不推送镜像） |

## 环境变量配置

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中配置：

### Variables（仓库变量）
- `DOCKER_IMAGE` - Docker 镜像仓库地址（如：`registry.example.com/oilgas-test-platform`）
- `DOCKER_USERNAME` - Docker 仓库用户名

### Secrets（机密变量）
- `DOCKER_PASSWORD` - Docker 仓库密码/Token

## 镜像标签策略

### 开发环境镜像标签
- `dev-<branch-name>` - 分支名标签（如：`dev-develop`）
- `dev-<short-sha>` - 短提交哈希标签（如：`dev-a1b2c3d`）
- `dev-latest` - 最新开发版本（仅默认分支）

### 生产环境镜像标签
- `prod-<branch-name>` - 分支名标签（如：`prod-main`）
- `prod-<short-sha>` - 短提交哈希标签（如：`prod-a1b2c3d`）
- `prod-latest` - 最新生产版本（仅默认分支）
- `<version>` - 语义化版本（如 `v1.0.0`，需要打 tag）
- `<major>.<minor>` - 主要版本（如 `1.0`）

## 工作流程图

```
代码推送
    ↓
代码质量检查 (lint, typecheck, format)
    ↓
构建验证 (build + 验证产物)
    ↓
┌─────────┴─────────┐
│                   │
develop 分支        main 分支
│                   │
↓                   ↓
开发环境镜像        生产环境镜像
构建并推送          构建并推送
```

## 并发控制

工作流使用 `concurrency` 配置防止多个构建同时进行：
- 同一分支的多次推送会取消之前的构建
- 确保只有最新的代码被构建

## 本地开发参考

### 环境变量配置

在生产环境中，需要设置以下环境变量：
- `API_URL` - 后端 API 地址（如：`http://api-service:8080`）

### Docker 运行

```bash
# 构建镜像
docker build -f ci/Dockerfile -t oilgas-test-platform:latest .

# 运行容器（需要设置 API_URL）
docker run -p 8080:8080 -e API_URL=http://localhost:8080 oilgas-test-platform:latest
```

### 手动部署

镜像推送成功后，需要手动部署：

1. **开发环境部署**
   ```bash
   # 拉取最新镜像
   docker pull registry.example.com/oilgas-test-platform:dev-latest

   # 停止旧容器
   docker stop oilgas-test-dev || true

   # 启动新容器
   docker run -d \
     --name oilgas-test-dev \
     -p 8080:8080 \
     -e API_URL=http://backend-dev:8080 \
     registry.example.com/oilgas-test-platform:dev-latest
   ```

2. **生产环境部署**
   ```bash
   # 拉取指定版本镜像
   docker pull registry.example.com/oilgas-test-platform:prod-v1.0.0

   # 停止旧容器
   docker stop oilgas-test-prod || true

   # 启动新容器
   docker run -d \
     --name oilgas-test-prod \
     -p 8080:8080 \
     -e API_URL=http://backend-prod:8080 \
     registry.example.com/oilgas-test-platform:prod-v1.0.0
   ```

## 故障排查

### 常见问题

1. **代码检查失败**
   - 本地运行 `pnpm format:check`、`pnpm lint`、`pnpm typecheck`
   - 修复所有错误后重新推送

2. **镜像构建失败**
   - 检查 Dockerfile 语法
   - 确认依赖安装正常
   - 查看构建日志中的具体错误

3. **镜像推送失败**
   - 确认 `DOCKER_USERNAME` 和 `DOCKER_PASSWORD` 配置正确
   - 检查镜像仓库地址是否正确
   - 确认有推送权限

## 最佳实践

1. **提交信息规范**
   - 使用语义化提交信息
   - 示例：`feat: 添加用户管理功能`、`fix: 修复登录页面样式问题`

2. **分支管理**
   - `develop` - 开发分支，自动构建开发镜像
   - `main` - 生产分支，自动构建生产镜像
   - 功能分支 - 通过 PR 合并到 develop

3. **版本控制**
   - 生产环境部署前，建议打 tag
   - 使用语义化版本：`v1.0.0`、`v1.1.0` 等
   - Tag 会自动触发生产镜像构建

## 监控和日志

### GitHub Actions 日志
- 访问 GitHub 仓库的 Actions 标签页
- 查看每个工作流的详细日志
- 下载构建产物进行调试

### 构建产物
- 成功构建后可下载 `dist` 目录
- 用于本地测试或手动部署