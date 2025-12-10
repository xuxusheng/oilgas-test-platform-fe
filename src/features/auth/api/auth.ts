import request from '../../../utils/request';
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInfo
} from '../types';

/** 用户登录 */
export const login = (data: LoginRequest) => {
  return request.post<any, ApiResponse<LoginResponse>>('/auth/login', data);
};

/** 用户登录 Hook */
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

/** 用户注册 */
export const register = (data: RegisterRequest) => {
  return request.post<any, ApiResponse<RegisterResponse>>('/auth/register', data);
};

/** 用户注册 Hook */
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

/** 用户登出 */
export const logout = () => {
  return request.post<any, ApiResponse<null>>('/auth/logout');
};

/** 用户登出 Hook */
export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

/** 获取当前用户信息 */
export const getUserInfo = () => {
  return request.get<any, ApiResponse<UserInfo>>('/auth/me');
};

/** 获取当前用户信息 Hook */
export const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });
};
