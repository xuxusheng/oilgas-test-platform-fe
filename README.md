# 油气测试平台前端 v2

基于 React 19 + TypeScript + Vite + Ant Design v6 构建的现代化油气测试平台前端应用。

## 🚀 快速开始

### 开发环境
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产包
pnpm build

# 预览生产构建
pnpm preview

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 📁 项目结构

```
src/
├── assets/           # 静态资源
├── components/       # 可复用组件
├── features/         # 功能模块
│   ├── auth/         # 认证
│   ├── user/         # 用户管理
│   ├── project/      # 项目管理
│   ├── inspection-device/  # 设备管理
│   ├── oil-sample/   # 油样管理
│   └── test-station/ # 测试工位管理
├── hooks/            # 自定义 Hooks
├── layouts/          # 布局组件
├── pages/            # 页面组件
├── router/           # 路由配置
├── store/            # 状态管理
├── types/            # TypeScript 类型
├── utils/            # 工具函数
└── main.tsx          # 应用入口
```

## 🎯 核心功能

### 功能模块
- ✅ **用户管理** - 用户增删改查、角色管理
- ✅ **项目管理** - 项目创建、编辑、状态管理
- ✅ **设备管理** - 设备全生命周期管理
- ✅ **油样管理** - 油样创建、用途分类、状态管理
- ✅ **测试工位** - 工位配置、通信管理、状态控制

### 技术栈
- **框架**: React 19.2 + TypeScript
- **构建**: Vite + Rolldown
- **UI**: Ant Design v6 + ProComponents
- **状态**: Zustand (带持久化)
- **路由**: React Router DOM v7
- **数据**: Axios + React Query
- **图表**: ECharts
- **样式**: Tailwind CSS v4

## 🔧 开发工具

### 代码质量
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型安全

### 开发体验
- **热重载** - Vite 快速开发
- **Type Safety** - 完整的 TypeScript 支持
- **组件库** - Ant Design ProComponents

## 📖 开发指南

### API 集成规则
```typescript
// ✅ 正确：API 路径以 / 开头
request.get('/users/page')

// ❌ 错误：不要重复 /api 前缀
request.get('/api/users/page')  // 最终变成 /api/api/users/page
```

### 命名规范
- **请求接口**: `xxxRequest` (例如: `LoginRequest`)
- **响应接口**: `xxxResponse` (例如: `LoginResponse`)
- **避免使用**: `xxxParams` 或 `xxxResult`

### 路由配置
- 使用 `createBrowserRouter` 配置路由
- 保护路由使用 `BasicLayout` 和 `RequireAuth`
- 路由常量统一管理

## 🚀 生产部署

### 构建
```bash
pnpm build
```

### 环境配置
应用不需要特定环境变量，通过以下方式配置 API：
- **开发环境**: Vite 代理 `/api` → `http://localhost:8080`
- **生产环境**: Nginx 等反向代理 `/api/*` → 后端服务

## 📚 更多文档

- [CLAUDE.md](./CLAUDE.md) - 项目详细指南

## 🎯 React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
