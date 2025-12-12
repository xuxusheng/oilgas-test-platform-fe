/**
 * 特性模块通用常量定义
 */

/**
 * 分页参数默认值
 */
export const PaginationDefaults = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 10,
  MAX_SIZE: 100,
  MIN_PAGE: 1,
} as const

/**
 * 排序顺序常量
 */
export const SortOrder = {
  ASC: 'asc' as const,
  DESC: 'desc' as const,
}

/**
 * 通用响应状态码
 */
export const ResponseCodes = {
  SUCCESS: 200, // 成功
  VALIDATION_ERROR: 400, // 参数验证错误
  UNAUTHORIZED: 401, // 未授权
  FORBIDDEN: 403, // 禁止访问
  NOT_FOUND: 404, // 资源不存在
  INTERNAL_ERROR: 500, // 服务器内部错误
} as const

/**
 * 数据状态常量
 */
export const DataStatus = {
  ACTIVE: 'ACTIVE', // 激活状态
  INACTIVE: 'INACTIVE', // 非激活状态
  DELETED: 'DELETED', // 删除状态
  SUSPENDED: 'SUSPENDED', // 暂停状态
} as const

/**
 * 时间格式常量
 */
export const DateTimeFormat = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
} as const
