import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Typography, App, Alert } from 'antd'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useLogin, useSystemStatus } from '../../features/auth/api/auth'
import { useAuthStore } from '../../store/useAuthStore'
import { useEffect } from 'react'

import type { LoginRequest } from '../../features/auth/types'

const { Title, Text } = Typography

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken, setUserInfo } = useAuthStore()
  const { mutateAsync: login, isPending } = useLogin()
  const { message: messageApi } = App.useApp()

  // 检测系统状态
  const { data: systemStatus, error: statusError } = useSystemStatus()

  const from = location.state?.from?.pathname || '/dashboard'

  // 系统状态检测效果
  useEffect(() => {
    if (statusError) {
      messageApi.warning('系统状态检测失败，部分功能可能受限')
    }
  }, [statusError, messageApi])

  const onFinish = async (values: LoginRequest) => {
    const res = await login(values)
    messageApi.success('登录成功')
    setToken(res.data.data.accessToken)
    setUserInfo({
      id: res.data.data.userId,
      username: res.data.data.username,
      role: res.data.data.role,
    })
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Left side - Branding/Image - Scheme A: Enhanced Texture & Depth */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-800 via-blue-900 to-blue-950 bg-enhanced-texture justify-center items-center relative overflow-hidden">
        {/* Dynamic light scan overlay */}
        <div className="absolute inset-0 animate-light-scan pointer-events-none"></div>

        {/* Deep background layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/90 via-blue-800/85 to-blue-950/95"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-blue-900/25"></div>

        {/* Primary floating orbs - enhanced with gradient and opacity */}
        <div className="w-96 h-96 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-full absolute -top-32 -left-32 blur-3xl animate-float-slow opacity-70"></div>
        <div className="w-[28rem] h-[28rem] bg-gradient-to-br from-blue-400/30 via-blue-600/20 to-blue-800/10 rounded-full absolute bottom-0 right-0 blur-3xl animate-float-medium opacity-60"></div>
        <div className="w-72 h-72 bg-gradient-to-br from-blue-300/25 to-blue-500/15 rounded-full absolute top-1/3 right-16 blur-2xl animate-float-fast opacity-50"></div>

        {/* Secondary geometric accents */}
        <div className="w-40 h-40 bg-gradient-to-br from-white/25 to-transparent rounded-xl absolute top-24 right-40 blur-xl animate-glow-pulse rotate-45 opacity-80"></div>
        <div className="w-56 h-56 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full absolute bottom-36 left-24 blur-2xl animate-shimmer opacity-70"></div>

        {/* Micro shimmer particles - multiple layers */}
        <div className="w-20 h-20 bg-white/25 rounded-full absolute top-1/4 left-1/3 blur-lg animate-shimmer"></div>
        <div
          className="w-16 h-16 bg-blue-300/30 rounded-full absolute bottom-2/5 right-1/3 blur-lg animate-shimmer"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="w-12 h-12 bg-white/20 rounded-full absolute top-1/2 left-1/5 blur-md animate-shimmer"
          style={{ animationDelay: '3s' }}
        ></div>

        {/* Main content area with enhanced glassmorphism */}
        <div className="relative z-10 text-white px-16 text-center">
          {/* Brand icon - enhanced glassmorphism with multi-layer glow */}
          <div className="w-28 h-28 glass-morphism glow-effect rounded-3xl flex items-center justify-center mx-auto mb-10 animate-pulse-slow hover:scale-110 transition-transform duration-300 cursor-pointer group relative overflow-hidden">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>

            <svg
              className="w-14 h-14 text-white relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>

          {/* Enhanced typography with multi-layer shadow and glow */}
          <h1 className="text-6xl font-extrabold mb-6 animate-fade-in-down text-shadow-lg drop-shadow-xl tracking-tight">
            油气测试平台
          </h1>
          <p className="text-xl text-blue-100 animate-fade-in-up opacity-95 font-semibold leading-relaxed">
            为能源行业提供专业的测试与管理解决方案
          </p>

          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-8 h-0.5 bg-white/40 rounded-full animate-glow-pulse"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse-slow"></div>
            <div className="w-8 h-0.5 bg-white/40 rounded-full animate-glow-pulse"></div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 animate-fade-in-right">
          <div className="text-center mb-8">
            <Title
              level={2}
              style={{ marginBottom: 0, color: '#1f2937' }}
              className="animate-fade-in-down"
            >
              欢迎回来
            </Title>
            <Text type="secondary" className="animate-fade-in-up">
              请输入您的账户信息登录
            </Text>
          </div>

          {/* 系统状态提示 */}
          {systemStatus && systemStatus.data.data.firstDeployment && (
            <Alert
              message="系统未初始化"
              description="系统首次部署，请先创建管理员账户。"
              type="warning"
              showIcon
              className="mb-4 animate-fade-in-down rounded-lg"
              action={
                <Link to="/init-admin">
                  <Button
                    size="small"
                    type="primary"
                    className="shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    去初始化
                  </Button>
                </Link>
              }
            />
          )}

          {statusError && (
            <Alert
              message="系统状态检测失败"
              description="部分功能可能受限，请检查网络连接。"
              type="warning"
              showIcon
              className="mb-4 animate-fade-in-down rounded-lg"
            />
          )}

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            initialValues={{ remember: true }}
          >
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
              <Input
                prefix={
                  <UserOutlined className="text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                }
                placeholder="用户名"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-600 focus:shadow-md transition-all duration-200 group"
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
              <Input.Password
                prefix={
                  <LockOutlined className="text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                }
                placeholder="密码"
                className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-600 focus:shadow-md transition-all duration-200 group"
                autoComplete="new-password"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="hover:text-blue-600 transition-colors duration-200">
                  记住我
                </Checkbox>
              </Form.Item>
              <a
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 relative group"
                href="#"
              >
                忘记密码？
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isPending}
                className="h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 border-none rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    登录中...
                  </span>
                ) : (
                  '登录'
                )}
              </Button>
            </Form.Item>

            <div className="text-center mt-6 text-gray-500">
              没有账户？{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 relative group"
              >
                立即注册
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login
