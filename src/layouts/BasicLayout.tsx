import { ProLayout } from '@ant-design/pro-components'
import { Dropdown } from 'antd'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { menuConfig } from '../router'

export default function BasicLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userInfo, logout } = useAuthStore()

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心',
        onClick: () => {},
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: '个人设置',
        onClick: () => {},
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        danger: true,
        onClick: () => {
          logout()
          navigate('/login')
        },
      },
    ],
  }

  return (
    <ProLayout
      title="油气测试平台"
      logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      layout="mix"
      splitMenus={false}
      contentWidth="Fluid"
      fixedHeader
      fixSiderbar
      location={{ pathname: location.pathname }}
      menu={{ request: async () => menuConfig }}
      menuItemRender={(item, dom) => <Link to={item.path || '/'}>{dom}</Link>}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        size: 'small',
        title: userInfo?.username || '用户',
        render: (_, dom) => (
          <Dropdown menu={userMenu} placement="bottomRight">
            {dom}
          </Dropdown>
        ),
      }}
    >
      <Outlet />
    </ProLayout>
  )
}
