import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Typography, Alert, App } from 'antd'
import { UserOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { getSystemStatus, useInitAdmin } from '../../features/auth/api/auth'
import type { FirstAdminCreateRequest } from '../../features/auth/types'

const { Title, Text } = Typography

/**
 * 系统首次部署 - 管理员账户创建页面
 * 现代简约设计 + 清爽浅色模式
 */
const InitAdmin = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { message: messageApi } = App.useApp()
  const [form] = Form.useForm()

  // 页面状态
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdUser, setCreatedUser] = useState<{ username: string; role: string } | null>(null)
  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    text: '-',
    color: 'text-gray-400',
    bg: 'bg-gray-300',
  })

  // Mutation
  const { mutateAsync: initAdmin, isPending: isCreating } = useInitAdmin()

  // 密码强度计算
  const calculatePasswordStrength = (
    password: string,
  ): { level: number; text: string; color: string; bg: string } => {
    if (!password) return { level: 0, text: '-', color: 'text-gray-400', bg: 'bg-gray-300' }

    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 10) score += 1
    if (password.length >= 14) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^a-zA-Z0-9]/.test(password)) score += 1

    const levels = [
      { level: 0, text: '弱', color: 'text-red-500', bg: 'bg-red-400' },
      { level: 1, text: '一般', color: 'text-orange-500', bg: 'bg-orange-400' },
      { level: 2, text: '良好', color: 'text-blue-500', bg: 'bg-blue-400' },
      { level: 3, text: '强', color: 'text-emerald-500', bg: 'bg-emerald-400' },
      { level: 4, text: '很强', color: 'text-green-600', bg: 'bg-green-500' },
    ]

    const levelIndex = Math.min(Math.floor(score / 2), 4)
    return levels[levelIndex]
  }

  // 监听密码变化
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const strength = calculatePasswordStrength(value)
    setPasswordStrength(strength)

    // 实时验证确认密码
    const confirmPassword = form.getFieldValue('confirmPassword')
    if (confirmPassword && value !== confirmPassword) {
      form.validateFields(['confirmPassword'])
    }
  }

  // 系统状态刷新
  const refreshSystemStatus = async () => {
    await queryClient.fetchQuery({
      queryKey: ['system-status'],
      queryFn: getSystemStatus,
      staleTime: 0,
    })
  }

  // 跳转登录
  const handleGoLogin = async () => {
    try {
      await refreshSystemStatus()
    } catch {
      // 忽略错误，交由 RouteGuard 处理
    }
    navigate('/login', { replace: true })
  }

  // 表单提交
  const onFinish = async (values: FirstAdminCreateRequest) => {
    try {
      if (values.password !== values.confirmPassword) {
        messageApi.error('两次输入的密码不一致')
        return
      }

      if (values.password.length < 6 || values.password.length > 30) {
        messageApi.error('密码长度必须在6-30位之间')
        return
      }

      const response = await initAdmin({
        password: values.password,
        confirmPassword: values.confirmPassword,
      })

      setCreatedUser({
        username: response.data.data.username,
        role: response.data.data.role,
      })
      setShowSuccess(true)
      messageApi.success('管理员账户创建成功')
      void refreshSystemStatus()
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string; code?: number } } }
      const errorMsg = axiosError.response?.data?.message || '创建失败，请稍后重试'
      const errorCode = axiosError.response?.data?.code

      if (errorCode === 400 && errorMsg.includes('已存在')) {
        messageApi.error('系统已存在管理员账户，无法重复创建')
        setTimeout(() => navigate('/login', { replace: true }), 1500)
        return
      }

      messageApi.error(errorMsg)
    }
  }

  // 验证规则
  const validatePassword = (_: unknown, value: string) => {
    if (!value) return Promise.reject('请输入密码')
    if (value.length < 6) return Promise.reject('密码至少6位')
    if (value.length > 30) return Promise.reject('密码最多30位')
    return Promise.resolve()
  }

  const validateConfirmPassword = (_: unknown, value: string) => {
    if (!value) return Promise.reject('请确认密码')
    if (value !== form.getFieldValue('password')) return Promise.reject('两次输入的密码不一致')
    return Promise.resolve()
  }

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !showSuccess) {
        e.preventDefault()
        form.submit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [form, showSuccess])

  // 成功页面
  if (showSuccess && createdUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center border border-green-100 hover:shadow-xl transition-shadow duration-300">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm ring-2 ring-green-100 animate-bounce-subtle">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <Title level={3} style={{ marginBottom: 8, color: '#1f2937' }}>
            初始化完成
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            管理员账户创建成功
          </Text>

          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 text-left border border-green-100 hover:border-green-200 transition-colors duration-200">
            <div className="flex justify-between mb-2">
              <Text type="secondary">用户名</Text>
              <Text strong className="text-green-700">
                {createdUser.username}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text type="secondary">角色</Text>
              <Text strong className="text-purple-600">
                {createdUser.role}
              </Text>
            </div>
          </div>

          <Alert
            message="请妥善保管凭证"
            description="建议立即登录并定期更换密码"
            type="info"
            showIcon
            className="mt-4 text-left rounded-lg"
          />

          <Button
            type="primary"
            size="large"
            onClick={handleGoLogin}
            block
            className="mt-6 h-11 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            立即登录
          </Button>
        </div>
      </div>
    )
  }

  // 表单页面
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* 左侧说明区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12 border-r border-gray-200 relative overflow-hidden -mt-30">
        {/* 背景纹理 - 增强可见度的几何图案 */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 3px 3px, #3b82f6 1.5px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        ></div>

        <div className="max-w-sm text-center relative z-10">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-300 hover:scale-105 transform">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">系统首次部署</h1>
          <p className="text-gray-600">需要创建第一个管理员账户来完成系统初始化。</p>
        </div>
      </div>

      {/* 右侧表单区域 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center mb-6">
            <Title level={3} style={{ marginBottom: 0, color: '#111827' }}>
              创建管理员
            </Title>
          </div>

          <Form
            form={form}
            name="initAdmin"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            initialValues={{ username: 'admin' }}
          >
            <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                readOnly
                disabled
                className="rounded-md bg-gray-50 cursor-not-allowed transition-all duration-200 hover:bg-gray-100"
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
                placeholder="6-30位"
                className="rounded-md transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:shadow-sm"
                autoComplete="new-password"
                onChange={handlePasswordChange}
              />
            </Form.Item>

            {/* 密码强度指示器 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 hover:border-blue-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">密码强度</span>
                <span
                  className={`text-xs font-bold ${passwordStrength.color} transition-colors duration-300`}
                >
                  {passwordStrength.text}
                </span>
              </div>
              <div className="flex gap-1.5 h-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-full transition-all duration-500 ease-out ${
                      index <= passwordStrength.level * 1.25
                        ? `${passwordStrength.bg} shadow-sm`
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              {passwordStrength.level === 0 && (
                <div className="mt-2 text-xs text-gray-400 flex gap-2 flex-wrap leading-tight">
                  <span>• 6-30位</span>
                  <span>• 含大小写字母</span>
                  <span>• 含数字</span>
                  <span>• 含特殊符号</span>
                </div>
              )}
            </div>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              rules={[{ validator: validateConfirmPassword }]}
              dependencies={['password']}
              hasFeedback
            >
              <Input.Password
                prefix={<CheckCircleOutlined className="text-gray-400" />}
                placeholder="再次输入密码"
                className="rounded-md transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:shadow-sm"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isCreating}
                className="h-11 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    创建中...
                  </span>
                ) : (
                  '创建管理员账户'
                )}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default InitAdmin
