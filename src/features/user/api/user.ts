import request from '../../../utils/request'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ApiResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserPageRequest,
  UserPageResponse,
  ValidateUsernameRequest,
} from '../types'

/**
 * 用户管理 API 服务
 */

/** 获取所有用户列表 */
export const getAllUsers = () => {
  return request.get<ApiResponse<UserResponse[]>>('/users')
}

/** 获取所有用户列表 Hook */
export const useAllUsers = () => {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: getAllUsers,
  })
}

/** 分页查询用户列表 */
export const getUserPage = (params?: UserPageRequest) => {
  return request.get<ApiResponse<UserPageResponse>>('/users/page', { params })
}

/** 分页查询用户列表 Hook */
export const useUserPage = (params?: UserPageRequest) => {
  return useQuery({
    queryKey: ['users', 'page', params],
    queryFn: () => getUserPage(params),
  })
}

/** 根据ID查询用户 */
export const getUserById = (id: number) => {
  return request.get<ApiResponse<UserResponse>>(`/users/${id}`)
}

/** 根据ID查询用户 Hook */
export const useUserById = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
    enabled: !!id, // 只有当id存在时才执行查询
  })
}

/** 创建新用户 */
export const createUser = (data: CreateUserRequest) => {
  return request.post<ApiResponse<UserResponse>>('/users', data)
}

/** 创建新用户 Hook */
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 创建成功后，使相关的查询缓存失效，重新获取数据
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/** 更新用户信息 */
export const updateUser = (id: number, data: UpdateUserRequest) => {
  return request.put<ApiResponse<UserResponse>>(`/users/${id}`, data)
}

/** 更新用户信息 Hook */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) => updateUser(id, data),
    onSuccess: () => {
      // 更新成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/** 删除用户 */
export const deleteUser = (id: number) => {
  return request.delete<ApiResponse<void>>(`/users/${id}`)
}

/** 删除用户 Hook */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // 删除成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/** 验证用户名唯一性 */
export const validateUsername = (data: ValidateUsernameRequest) => {
  return request.get<ApiResponse<boolean>>(`/users/validate-username/${data.username}`)
}

/** 验证用户名唯一性 Hook */
export const useValidateUsername = (username: string) => {
  return useQuery({
    queryKey: ['users', 'validate-username', username],
    queryFn: () => validateUsername({ username }),
    enabled: !!username, // 只有当username存在时才执行查询
  })
}
