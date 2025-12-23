import { useEffect } from 'react'
import { App } from 'antd'

/**
 * 统一的 API 状态管理 Hook
 * 自动处理 loading、error 状态和错误提示
 */
export function useApiState<T>(query: {
  data?: T
  isLoading: boolean
  error: Error | null
  refetch: () => void
}) {
  const { message } = App.useApp()

  useEffect(() => {
    if (query.error) {
      message.error(query.error.message || '请求失败')
    }
  }, [query.error, message])

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
