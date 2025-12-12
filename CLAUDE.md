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
│   ├── auth/         # 认证功能
│   │   ├── api/      # 认证 API 接口
│   │   ├── types/    # 认证 TypeScript 类型
│   │   └── index.ts  # 认证功能统一导出
│   ├── user/         # 用户管理功能
│   │   ├── api/      # 用户管理 API 接口
│   │   ├── types/    # 用户管理 TypeScript 类型
│   │   └── index.ts  # 用户功能统一导出
│   ├── project/      # 项目管理功能
│   │   ├── api/      # 项目管理 API 接口
│   │   ├── types/    # 项目管理 TypeScript 类型
│   │   └── index.ts  # 项目功能统一导出
│   ├── inspection-device/  # 检测设备管理功能
│   │   ├── api/      # 设备管理 API 接口
│   │   ├── types/    # 设备管理 TypeScript 类型
│   │   └── index.ts  # 设备功能统一导出
│   ├── constants.ts  # 通用常量定义
│   ├── utils.ts      # 通用工具函数
│   └── index.ts      # 所有功能模块统一导出
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

## 功能模块说明

### 用户管理模块 (`src/features/user/`)

基于 OpenAPI 文档实现的完整用户管理功能，包括：

**API 接口：**
- `GET /api/users` - 获取所有用户列表
- `GET /api/users/page` - 分页查询用户列表（支持用户名模糊查询和角色筛选）
- `GET /api/users/{id}` - 根据ID查询用户详情
- `POST /api/users` - 创建新用户
- `PUT /api/users/{id}` - 更新用户信息
- `DELETE /api/users/{id}` - 删除用户（软删除）
- `POST /api/users/{id}/restore` - 恢复已删除用户

**TypeScript 类型：**
- `UserResponse` - 用户响应接口（不包含敏感信息）
- `CreateUserRequest` - 创建用户请求
- `UpdateUserRequest` - 更新用户请求
- `UserPageRequest` - 分页查询参数
- `UserRole` - 用户角色类型（ADMIN/ MEMBER）

**React Query 集成：**
- 提供完整的 hooks API (`useAllUsers`, `useUserPage`, `useCreateUser` 等)
- 自动缓存管理和失效处理
- 错误处理和重试机制

### 项目管理模块 (`src/features/project/`)

基于 OpenAPI 文档实现的完整项目管理功能，包括：

**API 接口：**
- `GET /api/projects` - 获取所有项目列表
- `GET /api/projects/page` - 分页查询项目列表（支持项目编号、名称、负责人模糊查询）
- `GET /api/projects/{id}` - 根据ID查询项目详情
- `GET /api/projects/by-project-no/{projectNo}` - 根据项目编号查询项目
- `GET /api/projects/validate-unique/{projectNo}` - 验证项目编号唯一性
- `POST /api/projects` - 创建新项目
- `PUT /api/projects/{id}` - 更新项目信息
- `DELETE /api/projects/{id}` - 删除项目（软删除）
- `POST /api/projects/{id}/restore` - 恢复已删除项目

**TypeScript 类型：**
- `ProjectResponse` - 项目响应接口
- `CreateProjectRequest` - 创建项目请求
- `UpdateProjectRequest` - 更新项目请求
- `ProjectPageRequest` - 分页查询参数
- `GetProjectByNoRequest` - 按编号查询请求
- `ValidateProjectNoRequest` - 验证项目编号请求

**React Query 集成：**
- 提供完整的 hooks API (`useAllProjects`, `useProjectPage`, `useCreateProject` 等)
- 自动缓存管理和失效处理
- 错误处理和重试机制

### 检测设备管理模块 (`src/features/inspection-device/`)

基于 OpenAPI 文档实现的完整检测设备管理功能，包括：

**API 接口：**
- `GET /api/inspection-devices` - 获取所有检测设备列表
- `GET /api/inspection-devices/page` - 分页查询设备列表（支持设备编号、出厂编号、IP地址模糊查询，状态和项目ID筛选）
- `GET /api/inspection-devices/{id}` - 根据ID查询设备详情
- `GET /api/inspection-devices/by-device-no/{deviceNo}` - 根据设备编号查询设备
- `GET /api/inspection-devices/validate-serial-number/{serialNumber}` - 验证出厂编号唯一性
- `GET /api/inspection-devices/validate-ip/{ip}` - 验证IP地址唯一性
- `POST /api/inspection-devices` - 创建检测设备
- `PUT /api/inspection-devices/{id}` - 更新设备信息
- `DELETE /api/inspection-devices/{id}` - 删除设备（软删除）
- `POST /api/inspection-devices/{id}/restore` - 恢复已删除设备

**TypeScript 类型：**
- `InspectionDeviceResponse` - 设备响应接口
- `CreateInspectionDeviceRequest` - 创建设备请求
- `UpdateInspectionDeviceRequest` - 更新设备请求
- `InspectionDevicePageRequest` - 分页查询参数
- `DeviceStatus` - 设备状态类型枚举
- `GetDeviceByNoRequest` - 按编号查询请求
- `ValidateSerialNumberRequest` - 验证出厂编号请求
- `ValidateIpRequest` - 验证IP地址请求

**设备状态枚举：**
- `PENDING_INSPECTION` - 待检
- `UNDER_INSPECTION` - 检测中
- `CALIBRATED` - 标定中
- `FACTORY_QUALIFIED` - 出厂合格
- `FACTORY_UNQUALIFIED` - 出厂不合格
- `UNDER_REPAIR` - 维修中
- `RESERVED_ONE/RESERVED_TWO` - 预留状态

**React Query 集成：**
- 提供完整的 hooks API (`useAllInspectionDevices`, `useInspectionDevicePage`, `useCreateInspectionDevice` 等)
- 自动缓存管理和失效处理
- 错误处理和重试机制

### 通用工具和常量 (`src/features/`)

**通用常量 (`constants.ts`):**
- `PaginationDefaults` - 分页参数默认值
- `SortOrder` - 排序顺序常量
- `ResponseCodes` - 通用响应状态码
- `DataStatus` - 数据状态常量
- `DateTimeFormat` - 时间格式常量

**通用工具函数 (`utils.ts`):**
- `handleApiError` - API 错误处理
- `handleApiSuccess` - 成功消息处理
- `extractDataFromResponse` - 响应数据提取
- `formatPaginationParams` - 分页参数格式化
- `isValidId` - ID有效性检查
- `safeStringEquals` - 安全字符串比较
- `formatFileSize` - 文件大小格式化
- `delay` - 延迟执行
- `deepClone` - 深度克隆
- `isMobile` - 移动设备检测
- `getCurrentTimestamp` - 获取当前时间戳
- `formatDateTime` - 日期时间格式化

## 重要说明

- 使用 Rolldown-Vite 提升构建性能
- Tailwind CSS v4 通过新的 `@tailwindcss/vite` 插件配置
- Zustand 持久化状态管理 token 和用户信息
- 整个应用使用 Ant Design v6 组件
- 当前无测试配置，如需测试需添加 Jest 或 Vitest

## 环境变量

应用需要以下环境变量：
- `VITE_API_BASE_URL` - 可选的 API 基础 URL（默认使用 `/api` 代理）

## 最佳实践与常见问题

**Ant Design Pro 组件使用：**
- **useRef 初始化：** 使用 `useRef<ActionType>(null)` 而不是 `useRef<ActionType>()`，以避免 TypeScript 报错 "Expected 1 arguments, but got 0"。
- **表格操作列：** 建议为操作列设置固定宽度和右侧固定，例如：`width: 120, fixed: 'right'`，以防止在列数较多时操作列被挤压或不可见。
- **表单自动填充：** 为防止浏览器（特别是 Chrome）自动填充新建表单：
  - 在 `ModalForm` 或 `ProForm` 上设置 `autoComplete="off"`
  - 对于密码字段，在 `fieldProps` 中设置 `autoComplete: 'new-password'`
  - 对于用户名字段，在 `fieldProps` 中设置 `autoComplete: 'off'`

**文案一致性：**
- **操作反馈：** 保持按钮动作动词与操作反馈文案的一致性。例如：按钮文案为“新建”时，成功提示应为“新建成功”，而不是“创建成功”。