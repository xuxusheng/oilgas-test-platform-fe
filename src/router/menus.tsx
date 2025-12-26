import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  ProjectOutlined,
  ToolOutlined,
  ExperimentOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'
import { ROUTES } from './routes'

export interface MenuItem {
  path: string
  name: string
  icon?: ReactNode
  children?: MenuItem[]
}

/**
 * 菜单配置
 * 使用路由常量，确保与路由定义一致
 */
export const menuConfig: MenuItem[] = [
  {
    path: ROUTES.DASHBOARD,
    name: '仪表盘',
    icon: <DashboardOutlined />,
  },
  {
    path: '/test-line',
    name: '测试线管理',
    icon: <ExperimentOutlined />,
    children: [
      {
        path: ROUTES.OIL_SAMPLES,
        name: '油样管理',
        icon: <ExperimentOutlined />,
      },
      {
        path: ROUTES.TEST_STATIONS,
        name: '测试工位',
        icon: <ApartmentOutlined />,
      },
    ],
  },
  {
    path: '/device-management',
    name: '设备管理',
    icon: <ToolOutlined />,
    children: [
      {
        path: ROUTES.INSPECTION_DEVICES,
        name: '待检设备',
        icon: <ExperimentOutlined />,
      },
    ],
  },
  {
    path: '/settings',
    name: '系统设置',
    icon: <SettingOutlined />,
    children: [
      {
        path: ROUTES.PROJECTS,
        name: '项目管理',
        icon: <ProjectOutlined />,
      },
      {
        path: ROUTES.USERS,
        name: '用户管理',
        icon: <UserOutlined />,
      },
    ],
  },
]
