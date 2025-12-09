import { ProLayout } from '@ant-design/pro-components';
import { Dropdown } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function BasicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useAppStore();

  return (
    <ProLayout
      title="Oil & Gas Platform"
      logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      layout="mix"
      splitMenus={false}
      contentWidth="Fluid"
      fixedHeader
      fixSiderbar
      location={{
        pathname: location.pathname,
      }}
      menu={{
        request: async () => {
          return [
            {
              path: '/dashboard',
              name: 'Dashboard',
              icon: <UserOutlined />,
            },
            {
              path: '/users',
              name: 'User Management',
              icon: <UserOutlined />,
            },
          ];
        },
      }}
      menuItemRender={(item, dom) => (
        <div
          onClick={() => {
            navigate(item.path || '/');
          }}
        >
          {dom}
        </div>
      )}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        size: 'small',
        title: 'Admin',
        render: (props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
    >
      <Outlet />
    </ProLayout>
  );
}
