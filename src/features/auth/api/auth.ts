import request from '../../../utils/request'
import { useMutation, useQuery } from '@tanstack/react-query'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfo,
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
