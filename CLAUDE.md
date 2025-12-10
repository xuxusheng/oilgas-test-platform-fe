# CLAUDE.md

此文件为在本仓库中使用 Claude Code (claude.ai/code) 提供项目指导。

## 项目概述

这是一个基于 React 的油气测试平台前端应用程序，采用现代 Web 技术栈构建。项目使用 React 19.2、TypeScript、Vite 和基于功能模块的架构设计。

## 开发命令

**开发运行：**
- `pnpm dev` - 启动 Vite 开发服务器（包含热重载）
- `pnpm preview` - 本地预览生产构建

**构建与代码检查：**
- `pnpm build` - 构建 TypeScript 并生成生产包
- `pnpm lint` - 运行 ESLint 进行代码质量检查

**测试：**
package.json 中当前未配置测试脚本。

## 架构与结构

### 技术栈
- **框架：** React 19.2 + TypeScript
- **构建工具：** Vite + Rolldown (7.2.5)
- **样式：** Tailwind CSS 4.1
- **状态管理：** Zustand + 持久化
- **路由：** React Router DOM v7
- **UI 组件：** Ant Design v6 + ProComponents
- **数据请求：** Axios + React Query
- **图表：** ECharts + react 封装
- **样式工具：** Tailwind CSS + clsx + tailwind-merge

### 项目结构
```
src/
├── assets/           # 静态资源（图片等）
├── components/       # 可复用组件（目前为空）
├── features/         # 功能模块
│   └── auth/         # 认证功能
│       ├── api/      # 认证 API 接口
│       ├── types/    # 认证 TypeScript 类型
├── layouts/          # 布局组件 (BasicLayout)
├── pages/            # 页面组件
│   ├── Dashboard/    # 仪表盘页面
│   ├── Login/        # 登录页面
│   ├── Register/     # 注册页面
│   └── UserList/     # 用户管理页面
├── router/           # React Router 配置
├── services/         # API 服务（目前为空）
├── store/            # Zustand 状态管理
│   ├── useAppStore.ts     # 应用全局状态
│   └── useAuthStore.ts    # 认证状态（带持久化）
├── types/            # 全局 TypeScript 类型
├── utils/            # 工具函数
│   └── request.ts    # Axios 实例（带拦截器）
└── main.tsx          # 应用入口文件
```

### 核心模式

**命名规范：**
- **API 接口类型：**
  - 请求参数接口命名为 `xxxRequest` (例如: `LoginRequest`)
  - 响应数据接口命名为 `xxxResponse` (例如: `LoginResponse`)
  - 避免使用 `xxxParams` 或 `xxxResult`，以保持与 HTTP 协议语义一致

**认证流程：**
- 使用 Zustand 存储配合中间件实现 Token 持久化
- Axios 拦截器自动添加认证头信息
- 401 响应触发自动登出
- 认证状态以 'auth-storage' 为名持久化到 localStorage

**路由系统：**
- React Router v7 + createBrowserRouter
- 使用 BasicLayout 作为父组件实现保护路由模式
- 自动从 `/` 重定向到 `/dashboard`
- 独立认证路由：`/login` 和 `/register`

**API 集成：**
- 集中式 axios 实例，支持基础 URL 配置
- 默认 10 秒超时
- 通过 Ant Design message 组件进行错误提示
- 开发环境代理配置：`/api` -> `http://localhost:8080`

### 配置文件

**Vite：**
- TypeScript 编译 + SWC React 插件
- Tailwind CSS 集成
- 开发环境 API 代理

**TypeScript：**
- 分离配置：`tsconfig.app.json` + `tsconfig.node.json`
- 启用严格类型检查

**ESLint：**
- 平面配置 + TypeScript + React hooks + React refresh
- 忽略 `dist` 目录

## 重要说明

- 使用 Rolldown-Vite 提升构建性能
- Tailwind CSS v4 通过新的 `@tailwindcss/vite` 插件配置
- Zustand 持久化状态管理 token 和用户信息
- 整个应用使用 Ant Design v6 组件
- 当前无测试配置，如需测试需添加 Jest 或 Vitest

## 环境变量

应用需要以下环境变量：
- `VITE_API_BASE_URL` - 可选的 API 基础 URL（默认使用 `/api` 代理）