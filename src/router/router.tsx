import { createBrowserRouter, Navigate } from 'react-router-dom'
import BasicLayout from '../layouts/BasicLayout'
import Dashboard from '../pages/Dashboard'
import UserList from '../pages/UserList'
import ProjectList from '../pages/ProjectList'
import InspectionDeviceList from '../pages/InspectionDeviceList'
import OilSampleList from '../pages/OilSampleList'
import Login from '../pages/Login'
import Register from '../pages/Register'
import RequireAuth from '../components/RequireAuth'
import { ROUTES } from './routes'

/**
 * 应用路由配置
 * 使用路由常量确保与菜单配置一致
 */
const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
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
    ],
  },
])

export default router
