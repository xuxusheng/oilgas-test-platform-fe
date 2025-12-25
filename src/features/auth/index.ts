// 认证功能模块统一导出

// 类型定义
export type {
  LoginRequest,
  RegisterRequest,
  UserInfo,
  LoginResponse,
  RegisterResponse,
  SystemStatusResponse,
  FirstAdminCreateRequest,
  UserResponse,
} from './types'

// API 服务
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
} from './api/auth'

// 工具函数
export {
  handleAuthError,
  handleSystemStatusError,
  handleInitAdminError,
  validatePasswordStrength,
  formatSystemStatus,
  isFirstDeployment,
  getFriendlyErrorMessage,
  showAuthErrorMessage,
  showAuthSuccessMessage,
} from './utils'
