// 认证功能模块统一导出

// 类型定义
export type {
  LoginRequest,
  RegisterRequest,
  UserInfo,
  LoginResponse,
  RegisterResponse,
} from './types'

// API 服务
export { login, useLogin, register, useRegister, getUserInfo, useUserInfo } from './api/auth'
