import { UserOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons';
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
    path: '/settings',
    name: '系统设置',
    icon: <SettingOutlined />,
    children: [
      {
        path: '/settings/users',
        name: '用户管理',
        icon: <UserOutlined />,
      },
    ],
  },
];
