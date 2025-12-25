// Features 模块统一导出

// 通用常量和工具函数
export * from './constants'

// 认证功能模块 - 明确导出避免冲突
export {
  login,
  useLogin,
  register,
  useRegister,
  getUserInfo,
  useUserInfo,
  getSystemStatus,
  useSystemStatus,
  initAdmin,
  useInitAdmin,
  handleAuthError,
  handleSystemStatusError,
  handleInitAdminError,
  validatePasswordStrength,
  formatSystemStatus,
  isFirstDeployment,
  getFriendlyErrorMessage,
  showAuthErrorMessage,
  showAuthSuccessMessage,
} from './auth'

// 认证相关类型
export type {
  LoginRequest,
  RegisterRequest,
  UserInfo,
  LoginResponse,
  RegisterResponse,
  SystemStatusResponse,
  FirstAdminCreateRequest,
} from './auth'

// 用户管理功能模块
export * from './user'

// 项目管理功能模块
export * from './project'

// 检测设备管理功能模块
export * from './inspection-device'

// 油样管理功能模块
export * from './oil-sample'

// 测试工位管理功能模块
export * from './test-station'

// 类型导出
export type { ApiResponse } from '../types/api'
