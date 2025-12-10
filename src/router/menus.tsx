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
    name: 'Dashboard',
    icon: <DashboardOutlined />,
  },
  {
    path: '/settings',
    name: 'System Settings',
    icon: <SettingOutlined />,
    children: [
      {
        path: '/settings/users',
        name: 'User Management',
        icon: <UserOutlined />,
      },
    ],
  },
];
