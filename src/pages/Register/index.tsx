import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, App, Alert } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { useRegister, useSystemStatus } from '../../features/auth/api/auth'
import type { RegisterRequest } from '../../features/auth/types'
import { useEffect } from 'react'

const Register = () => {
  const navigate = useNavigate()
  const { mutate: registerMutate, isPending } = useRegister()
  const { message: messageApi } = App.useApp()

  // 检测系统状态
  const { data: systemStatus, error: statusError } = useSystemStatus()

  // 系统状态检测效果
  useEffect(() => {
    if (statusError) {
      messageApi.warning('系统状态检测失败，部分功能可能受限')
    }
  }, [statusError, messageApi])

  const onFinish = (values: RegisterRequest) => {
    registerMutate(values, {
      onSuccess: () => {
        messageApi.success('注册成功！请登录。')
        navigate('/login')
      },
      onError: (error: Error) => {
        console.error(error)
      },
    })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* 系统状态提示 */}
        {systemStatus && systemStatus.data.data.firstDeployment && (
          <Alert
            message="系统未初始化"
            description="系统首次部署，请先创建管理员账户。"
            type="warning"
            showIcon
            className="mb-4"
            action={
              <Link to="/init-admin">
                <Button size="small" type="primary">
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
            className="mb-4"
          />
        )}

        <Card title="注册" className="shadow-lg">
          <Form name="register" onFinish={onFinish} autoComplete="off" layout="vertical">
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名！' },
                { min: 3, max: 20, message: '用户名长度必须在3-20个字符之间' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码！' },
                { min: 6, max: 30, message: '密码长度必须在6-30个字符之间' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: '请确认密码！' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致！'))
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={isPending}>
                注册
              </Button>
            </Form.Item>

            <div className="text-center">
              已有账户？<Link to="/login">立即登录！</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default Register
