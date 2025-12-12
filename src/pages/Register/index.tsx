import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { useRegister } from '../../features/auth/api/auth'
import type { RegisterRequest } from '../../features/auth/types'

const Register = () => {
  const navigate = useNavigate()
  const { mutate: registerMutate, isPending } = useRegister()

  const onFinish = (values: RegisterRequest) => {
    registerMutate(values, {
      onSuccess: () => {
        message.success('Registration successful! Please login.')
        navigate('/login')
      },
      onError: (error: Error) => {
        console.error(error)
      },
    })
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card title="Register" className="w-96 shadow-lg">
        <Form name="register" onFinish={onFinish} autoComplete="off" layout="vertical">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, max: 20, message: 'Username must be between 3 and 20 characters' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, max: 30, message: 'Password must be between 6 and 30 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error('The two passwords that you entered do not match!'),
                  )
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isPending}>
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            Already have an account? <Link to="/login">Login now!</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register
