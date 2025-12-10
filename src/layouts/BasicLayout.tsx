import { ProLayout } from '@ant-design/pro-components';
import { Dropdown } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';
import { useLogout } from '../features/auth/api/auth';

export default function BasicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, token, logout: storeLogout } = useAuthStore();
  const { mutate: logoutMutate } = useLogout();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSettled: () => {
        storeLogout();
        navigate('/login');
      }
    });
  };

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
        title: userInfo?.username || 'User',
        render: (_, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: handleLogout,
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
