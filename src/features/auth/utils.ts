import { message } from 'antd'
import type { AxiosError } from 'axios'

/**
 * 认证模块工具函数
 */

/**
 * 处理认证相关的API错误
 */
export const handleAuthError = (error: AxiosError<{ message?: string }>): string => {
  const status = error.response?.status
  const errorMsg = error.response?.data?.message || error.message

  switch (status) {
    case 400:
      if (errorMsg.includes('已存在')) {
        return '系统已存在管理员，无法重复创建'
      }
      if (errorMsg.includes('密码')) {
        return '密码格式不正确或不符合要求'
      }
      return errorMsg || '请求参数错误'

    case 401:
      return '认证失败，请检查用户名和密码'

    case 403:
      return '权限不足，无法访问'

    case 404:
      return '请求的资源不存在'

    case 500:
      return '服务器内部错误，请稍后重试'

    case 502:
      return '网关错误，请检查网络连接'

    case 503:
      return '服务暂时不可用，请稍后重试'

    default:
      return errorMsg || '网络错误，请检查连接'
  }
}

/**
 * 系统状态检测错误处理
 */
export const handleSystemStatusError = (error: AxiosError<{ message?: string }>): string => {
  const status = error.response?.status

  if (status === 404) {
    return '系统状态接口不存在，请检查后端服务'
  }

  if (status === 500) {
    return '系统状态检测失败，服务器内部错误'
  }

  if (!status) {
    return '无法连接到服务器，请检查网络连接'
  }

  return `系统状态检测失败 (错误码: ${status})`
}

/**
 * 初始化管理员错误处理
 */
export const handleInitAdminError = (
  error: AxiosError<{ message?: string; code?: number }>,
): string => {
  const status = error.response?.status
  const errorMsg = error.response?.data?.message || error.message

  if (status === 400) {
    if (errorMsg.includes('已存在')) {
      return '系统已存在管理员，无法重复创建'
    }
    if (errorMsg.includes('密码')) {
      return '密码不符合要求（6-30位字符）'
    }
    return errorMsg || '请求参数错误'
  }

  if (status === 409) {
    return '系统正在初始化中，请勿重复提交'
  }

  if (status === 500) {
    return '服务器错误，管理员创建失败'
  }

  return errorMsg || '创建管理员失败，请稍后重试'
}

/**
 * 验证密码强度
 */
export const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
  if (!password || password.length < 6) {
    return { valid: false, message: '密码至少6位' }
  }

  if (password.length > 30) {
    return { valid: false, message: '密码最多30位' }
  }

  // 可选：更严格的密码强度检查
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const score = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length

  if (score < 2) {
    return { valid: true, message: '密码强度：弱（建议包含大小写字母和数字）' }
  } else if (score < 3) {
    return { valid: true, message: '密码强度：中' }
  } else {
    return { valid: true, message: '密码强度：强' }
  }
}

/**
 * 格式化系统状态信息
 */
export const formatSystemStatus = (status: {
  initialized: boolean
  status: string
  databaseConnected: boolean
}): string => {
  if (!status) return '未知状态'

  const { initialized, status: healthStatus, databaseConnected } = status

  if (!initialized) {
    return '系统未初始化'
  }

  if (healthStatus === 'healthy' && databaseConnected) {
    return '系统运行正常'
  }

  if (!databaseConnected) {
    return '数据库连接异常'
  }

  return `系统状态: ${healthStatus}`
}

/**
 * 检查是否为首次部署
 */
export const isFirstDeployment = (systemStatus: { initialized: boolean }): boolean => {
  return systemStatus && !systemStatus.initialized
}

/**
 * 获取友好的错误提示
 */
export const getFriendlyErrorMessage = (
  error: unknown,
  context: 'login' | 'register' | 'init-admin' | 'system-status',
): string => {
  const axiosError = error as AxiosError<{ message?: string; code?: number }>

  switch (context) {
    case 'login':
      return handleAuthError(axiosError)
    case 'register':
      return handleAuthError(axiosError)
    case 'init-admin':
      return handleInitAdminError(axiosError)
    case 'system-status':
      return handleSystemStatusError(axiosError)
    default:
      return '操作失败，请稍后重试'
  }
}

/**
 * 显示错误消息（带上下文）
 */
export const showAuthErrorMessage = (
  error: unknown,
  context: 'login' | 'register' | 'init-admin' | 'system-status',
): void => {
  const errorMessage = getFriendlyErrorMessage(error, context)
  message.error(errorMessage)
}

/**
 * 显示成功消息
 */
export const showAuthSuccessMessage = (action: 'login' | 'register' | 'init-admin'): void => {
  const messages = {
    login: '登录成功',
    register: '注册成功',
    'init-admin': '管理员账户创建成功',
  }
  message.success(messages[action])
}
