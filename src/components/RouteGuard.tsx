import React from 'react'
import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import { useAuthStore } from '../store/useAuthStore'
import { useSystemStatus } from '../features/auth/api/auth'
import { ROUTES } from '../router/routes'

interface RouteGuardProps {
  children?: React.ReactNode
  requireAuth?: boolean
}

/**
 * 路由守卫组件
 * 处理认证、系统状态检测和路由保护
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ children, requireAuth = true }) => {
  const { token } = useAuthStore()
  const location = useLocation()

  // 系统状态检测
  const {
    data: systemStatus,
    isLoading: statusLoading,
    isFetching: statusFetching,
    isFetchedAfterMount,
    error: statusError,
    refetch: refetchStatus,
  } = useSystemStatus()

  // 加载状态
  if (statusLoading || (statusFetching && !isFetchedAfterMount)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="正在检测系统状态..." />
      </div>
    )
  }

  // 系统状态检测失败（仅在需要系统状态的页面显示错误）
  if (
    statusError &&
    requireAuth &&
    !token &&
    location.pathname !== ROUTES.LOGIN &&
    location.pathname !== ROUTES.REGISTER
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Result
          status="error"
          title="系统状态检测失败"
          subTitle="请检查网络连接后重试"
          extra={[
            <Button key="retry" type="primary" onClick={() => refetchStatus()}>
              重试
            </Button>,
            <Button key="home" onClick={() => window.location.reload()}>
              刷新页面
            </Button>,
          ]}
        />
      </div>
    )
  }

  // 系统状态检测成功，进行路由决策
  if (systemStatus) {
    // firstDeployment: true 表示首次部署（未初始化），false 表示已初始化
    const isSystemInitialized = !systemStatus.data.data.firstDeployment

    // 系统未初始化（首次部署）
    if (!isSystemInitialized) {
      // 如果当前在初始化页面，允许访问
      if (location.pathname === ROUTES.INIT_ADMIN) {
        return <>{children || <Outlet />}</>
      }
      // 如果需要认证但没有token，跳转到初始化页面
      if (requireAuth && !token) {
        return <Navigate to={ROUTES.INIT_ADMIN} replace />
      }
      // 公共页面（登录/注册）也跳转到初始化
      if (
        !requireAuth &&
        !token &&
        (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER)
      ) {
        return <Navigate to={ROUTES.INIT_ADMIN} replace />
      }
    }

    // 系统已初始化
    if (isSystemInitialized) {
      // 如果当前在初始化页面，跳转到登录
      if (location.pathname === ROUTES.INIT_ADMIN) {
        return <Navigate to={ROUTES.LOGIN} replace />
      }
      // 如果需要认证但没有token，跳转到登录
      if (requireAuth && !token) {
        return <Navigate to={ROUTES.LOGIN} replace />
      }
      // 如果已登录且在登录/注册页面，跳转到仪表板
      if (
        !requireAuth &&
        token &&
        (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER)
      ) {
        return <Navigate to={ROUTES.DASHBOARD} replace />
      }
    }
  }

  // 放行
  return <>{children || <Outlet />}</>
}

export default RouteGuard
