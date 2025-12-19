// ApiResponse 类型直接在需要的文件中导入，避免冗余导出

/**
 * 用户角色类型
 */
export type UserRole = 'ADMIN' | 'MEMBER'

export const UserRoleConstants = {
  ADMIN: 'ADMIN' as UserRole, // 管理员
  MEMBER: 'MEMBER' as UserRole, // 普通成员
}

/**
 * 用户基本响应接口
 *
 * 用于返回用户公开信息的数据传输对象 (DTO)
 * 不包含密码等敏感信息
 */
export interface UserResponse {
  id: number // 用户ID，系统分配的唯一标识符
  username: string // 用户名
  role: UserRole // 用户角色，可选值：ADMIN(管理员) 或 MEMBER(普通成员)
  createdAt?: string // 创建时间（可选字段）
  updatedAt?: string // 更新时间（可选字段）
  createdBy?: number // 创建者用户ID（可选字段）
  updatedBy?: number // 最后更新者用户ID（可选字段）
}

/**
 * 创建用户请求接口
 *
 * POST /api/users
 * 包含创建新用户所需的所有信息
 */
export interface CreateUserRequest {
  username: string // 用户名，必填字段，长度3-20个字符
  password: string // 密码，必填字段，长度6-30个字符
  role: UserRole // 用户角色，必填字段，默认为 MEMBER
}

/**
 * 更新用户请求接口
 *
 * PUT /api/users/{id}
 * 包含更新用户信息的字段
 */
export interface UpdateUserRequest {
  username?: string // 用户名，可选字段
  password?: string // 密码，可选字段
  role?: UserRole // 用户角色，可选字段
}

/**
 * 用户分页查询请求接口
 *
 * GET /api/users/page
 * 支持按用户名模糊查询和角色精确筛选
 */
export interface UserPageRequest {
  page?: number // 当前页码，默认为 1
  size?: number // 每页记录数，默认为 10，最大 100
  sortField?: string // 排序字段，只允许字母、数字和下划线
  sortOrder?: 'asc' | 'desc' // 排序顺序
  username?: string // 用户名（模糊查询）
  role?: UserRole // 用户角色（精确匹配）
}

/**
 * 用户分页响应接口
 *
 * GET /api/users/page 响应数据
 */
export interface UserPageResponse {
  content: UserResponse[] // 用户列表
  total: number // 总记录数
  page: number // 当前页码
  size: number // 每页记录数
}

/**
 * 验证用户名唯一性请求接口
 *
 * GET /api/users/validate-username/{username}
 */
export interface ValidateUsernameRequest {
  /** 用户名 */
  username: string
}
