import { createBrowserRouter, Navigate } from 'react-router-dom'
import BasicLayout from '../layouts/BasicLayout'
import Dashboard from '../pages/Dashboard'
import UserList from '../pages/UserList'
import ProjectList from '../pages/ProjectList'
import InspectionDeviceList from '../pages/InspectionDeviceList'
import OilSampleList from '../pages/OilSampleList'
import TestStationList from '../pages/TestStationList'
import Login from '../pages/Login'
import Register from '../pages/Register'
import InitAdmin from '../pages/InitAdmin'
import RouteGuard from '../components/RouteGuard'
import { ROUTES } from './routes'

/**
 * 应用路由配置
 * 使用路由常量确保与菜单配置一致
 * 集成路由守卫处理认证和系统状态检测
 */
const router = createBrowserRouter([
  // 初始化管理员页面（无需认证，但受系统状态保护）
  {
    path: ROUTES.INIT_ADMIN,
    element: (
      <RouteGuard requireAuth={false}>
        <InitAdmin />
      </RouteGuard>
    ),
  },
  // 登录页面（无需认证，但已登录会重定向）
  {
    path: ROUTES.LOGIN,
    element: (
      <RouteGuard requireAuth={false}>
        <Login />
      </RouteGuard>
    ),
  },
  // 注册页面（无需认证，但已登录会重定向）
  {
    path: ROUTES.REGISTER,
    element: (
      <RouteGuard requireAuth={false}>
        <Register />
      </RouteGuard>
    ),
  },
  // 受保护的主布局（需要认证）
  {
    path: '/',
    element: (
      <RouteGuard requireAuth={true}>
        <BasicLayout />
      </RouteGuard>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: ROUTES.INSPECTION_DEVICES,
        element: <InspectionDeviceList />,
      },
      {
        path: ROUTES.PROJECTS,
        element: <ProjectList />,
      },
      {
        path: ROUTES.USERS,
        element: <UserList />,
      },
      {
        path: ROUTES.OIL_SAMPLES,
        element: <OilSampleList />,
      },
      {
        path: ROUTES.TEST_STATIONS,
        element: <TestStationList />,
      },
    ],
  },
])

export default router
