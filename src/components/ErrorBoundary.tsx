import React from 'react'

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，防止整个应用崩溃
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)

    // 可以在这里上报错误到监控系统
    // 例如：Sentry, LogRocket, 等
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">出错了</h2>
              <p className="text-gray-600 mb-4">
                应用遇到了意外错误，请刷新页面重试
              </p>
              {this.state.error && (
                <details className="text-left bg-gray-50 p-3 rounded mb-4 text-xs text-gray-600 overflow-auto">
                  <summary className="cursor-pointer mb-2 font-semibold">错误详情</summary>
                  <code>{this.state.error.message}</code>
                </details>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    this.setState({ hasError: false })
                    window.location.reload()
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  刷新页面
                </button>
                <button
                  onClick={() => {
                    this.setState({ hasError: false })
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  尝试恢复
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * 函数式错误边界 Hook（可选的高级用法）
 * 使用 React 16.8+ 的 Hooks API
 */
export function useErrorBoundary() {
  const [hasError, setHasError] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const reset = () => {
    setHasError(false)
    setError(null)
  }

  const catchError = (error: Error) => {
    setHasError(true)
    setError(error)
    console.error('Error caught:', error)
  }

  return { hasError, error, reset, catchError }
}

/**
 * 错误边界包装器组件（函数式）
 * 用于包裹需要错误处理的组件
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
