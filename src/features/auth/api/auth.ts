import request from '../../../utils/request'
import { useMutation, useQuery } from '@tanstack/react-query'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfo,
  SystemStatusResponse,
  FirstAdminCreateRequest,
  UserResponse,
} from '../types'
import type { ApiResponse } from '../../../types/api'

/** 用户登录 */
export const login = (data: LoginRequest) => {
  return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

/** 用户登录 Hook */
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  })
}

/** 用户注册 */
export const register = (data: RegisterRequest) => {
  return request.post<ApiResponse<RegisterResponse>>('/auth/register', data)
}

/** 用户注册 Hook */
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  })
}

/** 获取当前用户信息 */
export const getUserInfo = () => {
  return request.get<ApiResponse<UserInfo>>('/auth/me')
}

/** 获取当前用户信息 Hook */
export const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  })
}

/** 检测系统状态（无需认证） */
export const getSystemStatus = () => {
  return request.get<ApiResponse<SystemStatusResponse>>('/auth/system-status')
}

/** 检测系统状态 Hook */
export const useSystemStatus = () => {
  return useQuery({
    queryKey: ['system-status'],
    queryFn: getSystemStatus,
    staleTime: 0, // 不缓存，每次都请求最新状态
    gcTime: 0, // 禁用缓存垃圾回收
    refetchOnMount: 'always',
  })
}

/** 创建第一个管理员用户（仅在首次部署时可用） */
export const initAdmin = (data: FirstAdminCreateRequest) => {
  return request.post<ApiResponse<UserResponse>>('/auth/init-admin', data)
}

/** 创建第一个管理员用户 Hook */
export const useInitAdmin = () => {
  return useMutation({
    mutationFn: initAdmin,
  })
}
