// ApiResponse 类型直接在需要的文件中导入，避免冗余导出

/**
 * 登录请求参数接口
 *
 * POST /api/auth/login
 * 用户通过用户名和密码进行登录验证，成功后返回访问令牌及相关信息
 */
export interface LoginRequest {
  username: string // 用户名，必填字段，长度3-20个字符
  password: string // 密码，必填字段，长度6-100个字符
}

/**
 * 注册请求参数接口
 *
 * POST /api/auth/register
 * 新用户通过用户名和密码进行注册，创建新账户
 */
export interface RegisterRequest {
  username: string // 用户名，必填字段，长度3-20个字符
  password: string // 密码，必填字段，长度6-30个字符
}

/**
 * 用户信息接口
 *
 * GET /api/auth/me
 * 获取当前登录用户的详细信息
 */
export interface UserInfo {
  id: number // 用户ID，唯一标识符
  username: string // 用户名，账户名称
  role: string // 用户角色，可选值：ADMIN(管理员) 或 MEMBER(普通成员)
}

/**
 * 登录结果接口
 *
 * 登录成功后返回的详细信息，包括：
 * - 访问令牌及相关信息
 * - 用户基本信息
 * - 登录时间戳
 */
export interface LoginResponse {
  accessToken: string // 访问令牌，用于后续请求的身份验证(JWT Token)
  tokenType: string // 令牌类型，通常为 "Bearer"
  expiresIn: number // 令牌剩余有效期，单位：秒
  expiresAt: string // 令牌绝对过期时间，例如：2026-01-09T01:39:48.422921Z
  userId: number // 用户ID
  username: string // 用户名
  role: string // 用户角色，可选值：ADMIN(管理员) 或 MEMBER(普通成员)
  loginTime: string // 登录时间
}

/**
 * 注册结果接口
 *
 * 用户注册成功后返回的基本信息
 */
export interface RegisterResponse {
  id: number // 用户ID，系统分配的唯一标识符
  username: string // 用户名
  role: string // 用户角色，新注册用户默认为 MEMBER(普通成员)
}
