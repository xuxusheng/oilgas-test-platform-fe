import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Typography, App } from 'antd'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useLogin } from '../../features/auth/api/auth'
import { useAuthStore } from '../../store/useAuthStore'

import type { LoginRequest } from '../../features/auth/types'

const { Title, Text } = Typography

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken, setUserInfo } = useAuthStore()
  const { mutateAsync: login, isPending } = useLogin()
  const { message: messageApi } = App.useApp()

  const from = location.state?.from?.pathname || '/dashboard'

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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left side - Branding/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90"></div>
        <div className="relative z-10 text-white px-12 text-center">
          <h1 className="text-5xl font-bold mb-6">Oil & Gas Platform</h1>
          <p className="text-xl text-blue-100">
            Professional testing and management solution for the energy sector.
          </p>
          <div className="mt-12">
            {/* Abstract decorative circles */}
            <div className="w-64 h-64 bg-white/10 rounded-full absolute -top-20 -left-20 blur-3xl"></div>
            <div className="w-96 h-96 bg-blue-400/20 rounded-full absolute bottom-0 right-0 blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <Title level={2} style={{ marginBottom: 0, color: '#1f2937' }}>
              Welcome Back
            </Title>
            <Text type="secondary">Please enter your details to sign in</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Username"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-md"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a className="text-blue-600 hover:text-blue-800 text-sm font-medium" href="#">
                Forgot password?
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isPending}
                className="h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 border-none rounded-md"
              >
                Sign in
              </Button>
            </Form.Item>

            <div className="text-center mt-6 text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Register now
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login
