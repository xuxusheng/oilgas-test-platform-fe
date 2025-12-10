import request from '../../../utils/request';
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
  ApiResponse,
  LoginParams,
  LoginResult,
  RegisterParams,
  RegisterResult,
  UserInfo
} from '../types';

/**
 * 用户登录 - 基础API函数
 *
 * POST /api/auth/login
 * 用户通过用户名和密码进行登录验证，成功后返回访问令牌及相关信息
 *
 * @param data - 登录参数 { username, password }
 * @returns 登录结果的Promise，包含访问令牌和用户信息
 *
 * 使用示例：
 * ```typescript
 * const result = await login({ username: 'admin', password: 'password123' });
 * // result.data.accessToken 可用于后续请求的身份验证
 * ```
 */
export const login = (data: LoginParams) => {
  return request.post<any, ApiResponse<LoginResult>>('/auth/login', data);
};

/**
 * 用户登录 - React Query Hook
 *
 * 基于 useMutation 封装的登录Hook，自动处理加载状态、错误处理等
 *
 * 使用示例：
 * ```typescript
 * const loginMutation = useLogin();
 *
 * const handleLogin = async () => {
 *   const result = await loginMutation.mutateAsync({
 *     username: 'admin',
 *     password: 'password123'
 *   });
 *   // 处理登录成功逻辑
 * };
 * ```
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

/**
 * 用户注册 - 基础API函数
 *
 * POST /api/auth/register
 * 新用户通过用户名和密码进行注册，创建新账户
 *
 * @param data - 注册参数 { username, password }
 * @returns 注册结果的Promise，包含新用户的基本信息
 *
 * 使用示例：
 * ```typescript
 * const result = await register({ username: 'newuser', password: 'mypassword123' });
 * // result.data.id 新用户的ID
 * // result.data.role 默认为 'MEMBER'
 * ```
 */
export const register = (data: RegisterParams) => {
  return request.post<any, ApiResponse<RegisterResult>>('/auth/register', data);
};

/**
 * 用户注册 - React Query Hook
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

/**
 * 用户登出 - 基础API函数
 *
 * POST /api/auth/logout
 * 登出当前登录用户，使访问令牌失效
 *
 * 需要提供认证信息（Bearer Token）
 *
 * @returns 登出结果的Promise，data为null
 *
 * 使用示例：
 * ```typescript
 * await logout();
 * // 登出成功后，需要清除本地存储的token
 * localStorage.removeItem('accessToken');
 * ```
 */
export const logout = () => {
  return request.post<any, ApiResponse<null>>('/auth/logout');
};

/**
 * 用户登出 - React Query Hook
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

/**
 * 获取当前用户信息 - 基础API函数
 *
 * GET /api/auth/me
 * 获取当前登录用户的详细信息
 *
 * 需要提供认证信息（Bearer Token）
 *
 * @returns 用户信息的Promise，包含用户ID、用户名和角色
 *
 * 使用示例：
 * ```typescript
 * const result = await getUserInfo();
 * // result.data.id 用户ID
 * // result.data.username 用户名
 * // result.data.role 用户角色
 * ```
 */
export const getUserInfo = () => {
  return request.get<any, ApiResponse<UserInfo>>('/auth/me');
};

/**
 * 获取当前用户信息 - React Query Hook
 */
export const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
  });
};
