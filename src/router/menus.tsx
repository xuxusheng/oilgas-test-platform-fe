import { UserOutlined, DashboardOutlined, SettingOutlined, ProjectOutlined, ToolOutlined, ExperimentOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

export interface MenuItem {
  path: string;
  name: string;
  icon?: ReactNode;
  children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: <DashboardOutlined />,
  },
  {
    path: '/device-management',
    name: '设备管理',
    icon: <ToolOutlined />,
    children: [
      {
        path: '/device-management/inspection-devices',
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
        path: '/settings/projects',
        name: '项目管理',
        icon: <ProjectOutlined />,
      },
      {
        path: '/settings/users',
        name: '用户管理',
        icon: <UserOutlined />,
      },
    ],
  },
];
