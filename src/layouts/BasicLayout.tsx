import { ProLayout } from '@ant-design/pro-components';
import { Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { menuConfig } from '../router/menus';

export default function BasicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthStore();

  return (
    <ProLayout
      title="测试平台"
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
        request: async () => menuConfig,
      }}
      menuItemRender={(item, dom) => (
        <Link to={item.path || '/'}>
          {dom}
        </Link>
      )}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        size: 'small',
        title: userInfo?.username || '用户',
        render: (_, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <UserOutlined />,
                    label: '退出登录',
                    onClick: () => {
                      logout();
                      navigate('/login');
                    },
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
