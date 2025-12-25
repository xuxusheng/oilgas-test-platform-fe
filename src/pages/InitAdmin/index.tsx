import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Typography, Alert, Card, Result, App } from 'antd'
import { UserOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { getSystemStatus, useInitAdmin } from '../../features/auth/api/auth'
import type { FirstAdminCreateRequest } from '../../features/auth/types'

const { Title, Text, Paragraph } = Typography

/**
 * 系统首次部署 - 初始化管理员页面
 * 仅在系统首次部署时显示，用于创建第一个管理员账户
 */
const InitAdmin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { message: messageApi } = App.useApp()
  const [form] = Form.useForm()

  // 创建管理员的 mutation
  const { mutateAsync: initAdmin, isPending: isCreating } = useInitAdmin()

  // 页面状态
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdUser, setCreatedUser] = useState<{ username: string; role: string } | null>(null)

  const refreshSystemStatus = async () => {
    await queryClient.fetchQuery({
      queryKey: ['system-status'],
      queryFn: getSystemStatus,
      staleTime: 0,
    })
  }

  const handleGoLogin = async () => {
    try {
      await refreshSystemStatus()
    } catch {
      // 忽略系统状态刷新失败，交由 RouteGuard 再次判断
    }
    navigate('/login', { replace: true })
  }

  // 表单提交处理
  const onFinish = async (values: FirstAdminCreateRequest) => {
    try {
      // 前端验证
      if (values.password !== values.confirmPassword) {
        messageApi.error('两次输入的密码不一致')
        return
      }

      if (values.password.length < 6 || values.password.length > 30) {
        messageApi.error('密码长度必须在6-30位之间')
        return
      }

      // 调用创建管理员 API（用户名固定为 admin，无需传递）
      const response = await initAdmin({
        password: values.password,
        confirmPassword: values.confirmPassword,
      })

      // 创建成功
      setCreatedUser({
        username: response.data.data.username,
        role: response.data.data.role,
      })
      setShowSuccess(true)
      messageApi.success('管理员账户创建成功')

      // 立即刷新一次 system-status，避免随后跳转时命中旧缓存导致又回到 init-admin
      void refreshSystemStatus()
    } catch (error) {
      // 错误处理
      const axiosError = error as { response?: { data?: { message?: string; code?: number } } }
      const errorMsg = axiosError.response?.data?.message || '创建失败，请稍后重试'

      if (axiosError.response?.data?.code === 400) {
        if (errorMsg.includes('已存在')) {
          messageApi.error('系统已存在管理员，无法重复创建')
          setTimeout(() => navigate('/login', { replace: true }), 1500)
          return
        }
      }

      messageApi.error(errorMsg)
    }
  }

  // 密码验证规则
  const validatePassword = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject('请输入密码')
    }
    if (value.length < 6) {
      return Promise.reject('密码至少6位')
    }
    if (value.length > 30) {
      return Promise.reject('密码最多30位')
    }
    return Promise.resolve()
  }

  const validateConfirmPassword = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject('请确认密码')
    }
    if (value !== form.getFieldValue('password')) {
      return Promise.reject('两次输入的密码不一致')
    }
    return Promise.resolve()
  }

  // 成功页面
  if (showSuccess && createdUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <Result
            icon={<CheckCircleOutlined className="text-green-600" />}
            title="管理员账户创建成功"
            subTitle="系统初始化完成"
            extra={[
              <div key="info" className="mb-4 text-left">
                <Paragraph>
                  <Text strong>用户名：</Text> <Text code>{createdUser.username}</Text>
                </Paragraph>
                <Paragraph>
                  <Text strong>角色：</Text> <Text code>{createdUser.role}</Text>
                </Paragraph>
                <Paragraph type="secondary" className="mt-2">
                  请妥善保管您的登录信息
                </Paragraph>
              </div>,
              <Button key="login" type="primary" onClick={handleGoLogin} className="w-full">
                立即登录
              </Button>,
            ]}
          />
        </Card>
      </div>
    )
  }

  // 初始化表单页面
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 左侧品牌区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90"></div>
        <div className="relative z-10 text-white px-12 text-center">
          <div className="text-6xl mb-6">🏢</div>
          <h1 className="text-4xl font-bold mb-4">系统首次部署</h1>
          <p className="text-lg text-blue-100">
            油气测试平台需要创建第一个管理员账户来完成系统初始化
          </p>
          <div className="mt-12">
            <div className="w-64 h-64 bg-white/10 rounded-full absolute -top-20 -left-20 blur-3xl"></div>
            <div className="w-96 h-96 bg-blue-400/20 rounded-full absolute bottom-0 right-0 blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* 右侧表单区域 */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-6">
            <Title level={3} style={{ marginBottom: 8, color: '#1f2937' }}>
              系统首次部署
            </Title>
            <Text type="secondary">请创建第一个管理员账户</Text>
          </div>

          {/* 警告提示 */}
          <Alert
            message="重要提示"
            description="用户名固定为 admin，创建后无法修改。请妥善保管密码。"
            type="warning"
            showIcon
            className="mb-6"
          />

          <Form
            form={form}
            name="initAdmin"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            initialValues={{ username: 'admin' }}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="用户名"
                className="rounded-md"
                readOnly
                disabled
                title="用户名固定为 admin"
              />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ validator: validatePassword }]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码（6-30位）"
                className="rounded-md"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              rules={[{ validator: validateConfirmPassword }]}
              dependencies={['password']}
              hasFeedback
            >
              <Input.Password
                prefix={<CheckCircleOutlined className="text-gray-400" />}
                placeholder="请再次输入密码"
                className="rounded-md"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isCreating}
                className="h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 border-none rounded-md"
              >
                {isCreating ? '创建中...' : '创建管理员'}
              </Button>
            </Form.Item>

            <div className="text-center mt-4 text-sm text-gray-500">
              <Text type="secondary">系统初始化完成后，将自动跳转到登录页面</Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default InitAdmin
