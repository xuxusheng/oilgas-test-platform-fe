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

**代码格式化：**

- `pnpm format` - 使用 Prettier 格式化所有代码

## 架构与结构

### 技术栈

- **框架：** React 19.2 + TypeScript
- **构建工具：** Vite + Rolldown (7.2.10)
- **样式：** Tailwind CSS 4.1 + PostCSS + Autoprefixer
- **状态管理：** Zustand + 持久化
- **路由：** React Router DOM v7
- **UI 组件：** Ant Design v6 + ProComponents
- **数据请求：** Axios + React Query
- **图表：** ECharts + react 封装
- **样式工具：** Tailwind CSS + clsx + tailwind-merge
- **代码格式化：** Prettier

### 项目结构

```
src/
├── assets/           # 静态资源（图片等）
├── components/       # 可复用组件
│   ├── ErrorBoundary.tsx  # 错误边界组件
│   ├── RequireAuth.tsx    # 认证保护组件
│   └── index.ts           # 组件统一导出
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
│   ├── oil-sample/   # 油样管理功能
│   │   ├── api/      # 油样管理 API 接口
│   │   ├── types/    # 油样管理 TypeScript 类型
│   │   └── index.ts  # 油样功能统一导出
│   ├── test-station/ # 测试工位管理功能
│   │   ├── api/      # 测试工位 API 接口
│   │   ├── types/    # 测试工位 TypeScript 类型
│   │   └── index.ts  # 测试工位功能统一导出
│   ├── constants.ts  # 通用常量定义
│   └── index.ts      # 所有功能模块统一导出
├── hooks/            # 自定义 Hooks
│   └── useApiState.ts  # 统一的 API 状态管理 Hook
├── layouts/          # 布局组件 (BasicLayout)
├── pages/            # 页面组件
│   ├── Dashboard/    # 仪表盘页面
│   ├── Login/        # 登录页面
│   ├── Register/     # 注册页面
│   ├── UserList/     # 用户管理页面
│   ├── ProjectList/  # 项目管理页面
│   ├── InspectionDeviceList/  # 检测设备管理页面
│   ├── OilSampleList/  # 油样管理页面
│   └── TestStationList/  # 测试工位管理页面
├── router/           # React Router 配置
│   ├── router.tsx    # 路由实例配置
│   ├── routes.ts     # 路由常量定义
│   ├── menus.tsx     # 菜单配置
│   └── index.ts      # 路由统一导出
├── store/            # Zustand 状态管理
│   ├── useAuthStore.ts    # 认证状态（带持久化）
│   └── index.ts      # Store 统一导出
├── types/            # 全局 TypeScript 类型
│   └── api.ts        # API 通用类型
├── utils/            # 工具函数
│   └── request.ts    # Axios 实例（带拦截器）
├── main.tsx          # 应用入口文件
├── App.tsx           # 根组件
├── App.css           # 全局样式
└── index.css         # Tailwind CSS 入口

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
- 路由分组管理：认证、仪表盘、测试线、设备、系统设置
- 路由常量统一管理，支持参数化路径

**API 集成：**

- 集中式 axios 实例，使用相对路径 `/api` 作为 `baseURL`
- 默认 10 秒超时
- 通过 Ant Design message 组件进行错误提示
- Axios 拦截器自动添加认证 Token
- 401 响应自动触发登出
- 开发环境代理配置：`/api` -> `http://localhost:8080`

**API URL 规则（重要）：**

- **Axios 配置：** `baseURL: '/api'`（在 `src/utils/request.ts` 中定义）
- **API 调用：** 所有 API 路径必须以 `/` 开头，**不包含** `/api` 前缀
- **最终请求路径：** `baseURL` + `API路径` = `/api` + `/users/page` = `/api/users/page`
- **错误示例：** `request.get('/api/users')` → 最终路径 `/api/api/users` ❌
- **正确示例：** `request.get('/users')` → 最终路径 `/api/users` ✅
- **所有模块统一规则：** `auth`, `user`, `project`, `inspection-device`, `oil-sample`, `test-station` 均遵循此规则

### 配置文件

**Vite：**

- TypeScript 编译 + SWC React 插件
- Tailwind CSS v4 + `@tailwindcss/vite` 插件
- 开发环境 API 代理
- Rolldown 构建引擎提升性能

**TypeScript：**

- 分离配置：`tsconfig.app.json` + `tsconfig.node.json`
- 启用严格类型检查

**ESLint：**

- 平面配置 + TypeScript + React hooks + React refresh
- 集成 Prettier：`eslint-config-prettier`
- 忽略 `dist` 目录

**Prettier：**

- 代码格式化工具
- 统一代码风格
- 集成到 ESLint

## 功能模块说明

### 用户管理模块 (`src/features/user/`)

基于 OpenAPI 文档实现的完整用户管理功能，包括：

**API 接口：**

- `GET /users` - 获取所有用户列表
- `GET /users/page` - 分页查询用户列表（支持用户名模糊查询和角色筛选）
- `GET /users/{id}` - 根据ID查询用户详情
- `POST /users` - 创建新用户
- `PUT /users/{id}` - 更新用户信息
- `DELETE /users/{id}` - 删除用户（软删除）

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

- `GET /projects` - 获取所有项目列表
- `GET /projects/page` - 分页查询项目列表（支持项目编号、名称、负责人模糊查询）
- `GET /projects/{id}` - 根据ID查询项目详情
- `GET /projects/by-project-no/{projectNo}` - 根据项目编号查询项目
- `GET /projects/validate-unique/{projectNo}` - 验证项目编号唯一性
- `POST /projects` - 创建新项目
- `PUT /projects/{id}` - 更新项目信息
- `DELETE /projects/{id}` - 删除项目（软删除）

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

- `GET /inspection-devices` - 获取所有检测设备列表
- `GET /inspection-devices/page` - 分页查询设备列表（支持设备编号、出厂编号、IP地址模糊查询，状态和项目ID筛选）
- `GET /inspection-devices/{id}` - 根据ID查询设备详情
- `GET /inspection-devices/by-device-no/{deviceNo}` - 根据设备编号查询设备
- `GET /inspection-devices/validate-serial-number/{serialNumber}` - 验证出厂编号唯一性
- `GET /inspection-devices/validate-ip/{ip}` - 验证IP地址唯一性
- `POST /inspection-devices` - 创建检测设备
- `PUT /inspection-devices/{id}` - 更新设备信息
- `DELETE /inspection-devices/{id}` - 删除设备（软删除）

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

### 油样管理模块 (`src/features/oil-sample/`)

基于 OpenAPI 文档实现的完整油样管理功能，包括：

**API 接口：**

- `GET /oil-samples` - 获取所有油样列表
- `GET /oil-samples/page` - 分页查询油样列表（支持油样编号模糊查询、用途和状态筛选）
- `GET /oil-samples/{id}` - 根据ID查询油样详情
- `GET /oil-samples/by-sample-no/{sampleNo}` - 根据油样编号查询油样
- `GET /oil-samples/validate-sample-no/{sampleNo}` - 验证油样编号唯一性
- `POST /oil-samples` - 创建新油样
- `PUT /oil-samples/{id}` - 更新油样信息
- `DELETE /oil-samples/{id}` - 删除油样（软删除）

**TypeScript 类型：**

- `OilSampleResponse` - 油样响应接口
- `CreateOilSampleRequest` - 创建油样请求
- `UpdateOilSampleRequest` - 更新油样请求
- `OilSamplePageRequest` - 分页查询参数
- `OilSampleUsage` - 油样用途类型（清洗、标定、出厂测试、交叉灵敏度测试）
- `OilSampleStatus` - 油样状态类型（启用/禁用）
- `OilParameterKey` - 检测参数键类型（CH4, C2H2, C2H4, C2H6, H2, CO, CO2, H2O）
- `ParameterItem` - 参数项接口

**油样用途枚举：**

- `CLEANING` - 清洗用
- `CALIBRATION` - 标定用
- `FACTORY_TEST` - 出厂测试
- `CROSS_SENSITIVITY_TEST` - 交叉灵敏度测试

**油样状态枚举：**

- `ENABLED` - 启用
- `DISABLED` - 禁用

**检测参数枚举：**

- `CH4` - 甲烷
- `C2H2` - 乙炔
- `C2H4` - 乙烯
- `C2H6` - 乙烷
- `H2` - 氢气
- `CO` - 一氧化碳
- `CO2` - 二氧化碳
- `H2O` - 水

**React Query 集成：**

- 提供完整的 hooks API (`useAllOilSamples`, `useOilSamplePage`, `useCreateOilSample` 等)
- 自动缓存管理和失效处理
- 错误处理和重试机制

### 测试工位管理模块 (`src/features/test-station/`)

基于 OpenAPI 文档实现的完整测试工位管理功能，包括：

**API 接口：**

- `GET /test-stations` - 获取所有测试工位列表
- `GET /test-stations/page` - 分页查询测试工位列表（支持工位编号、名称、用途、责任人等筛选）
- `GET /test-stations/{id}` - 根据ID查询测试工位详情
- `GET /test-stations/by-station-no/{stationNo}` - 根据工位编号查询测试工位
- `GET /test-stations/validate-station-no/{stationNo}` - 验证工位编号唯一性
- `POST /test-stations` - 创建新测试工位
- `PUT /test-stations/{id}` - 更新测试工位信息
- `DELETE /test-stations/{id}` - 删除测试工位（软删除）
- `PATCH /test-stations/{id}/enable` - 启用测试工位
- `PATCH /test-stations/{id}/disable` - 禁用测试工位
- `PATCH /test-stations/{id}/toggle` - 切换测试工位启用状态

**TypeScript 类型：**

- `TestStationResponse` - 测试工位响应接口
- `CreateTestStationRequest` - 创建测试工位请求
- `UpdateTestStationRequest` - 更新测试工位请求
- `TestStationPageRequest` - 分页查询参数
- `TestStationUsage` - 工位用途类型（厂内测试/研发测试）
- `ValveCommType` - 电磁阀通信类型（串口 Modbus/TCP Modbus）

**工位用途枚举：**

- `INHOUSE_TEST` - 厂内测试
- `RND_TEST` - 研发测试

**电磁阀通信类型枚举：**

- `SERIAL_MODBUS` - 串口 Modbus
- `TCP_MODBUS` - TCP Modbus

**React Query 集成：**

- 提供完整的 hooks API (`useAllTestStations`, `useTestStationPage`, `useCreateTestStation` 等)
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

## 组件与 Hooks

### 可复用组件 (`src/components/`)

**ErrorBoundary.tsx:**

- React 错误边界组件
- 捕获子组件渲染过程中的错误
- 提供友好的错误展示界面
- 支持错误恢复和重试

**RequireAuth.tsx:**

- 认证保护组件
- 检查用户登录状态
- 未登录时自动跳转到登录页
- 用于保护需要认证的路由

### 自定义 Hooks (`src/hooks/`)

**useApiState.ts:**

- 统一的 API 状态管理 Hook
- 自动处理 loading、error 状态
- 集成 Ant Design message 错误提示
- 简化 React Query 使用模式

## 重要说明

- 使用 Rolldown-Vite 提升构建性能
- Tailwind CSS v4 通过新的 `@tailwindcss/vite` 插件配置
- Zustand 持久化状态管理 token 和用户信息
- 整个应用使用 Ant Design v6 组件
- 路由系统支持分组管理和参数化路径
- 统一的 API 错误处理和消息提示

## 环境变量

应用不需要特定的环境变量，所有 API 请求通过 Axios 的 `baseURL` 配置和 Vite 代理处理。

**请求流程：**
1. API 调用使用相对路径（如 `/users/page`）
2. Axios `baseURL: '/api'` 自动添加前缀 → `/api/users/page`
3. 开发环境：Vite 代理将 `/api/*` 转发到 `http://localhost:8080/*`
4. 生产环境：Nginx 等 Web 服务器配置反向代理 `/api/*` → 后端服务

**开发环境代理配置：** `vite.config.ts` 中设置 `/api` -> `http://localhost:8080`

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
