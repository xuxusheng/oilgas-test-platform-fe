import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Popconfirm, App } from 'antd'
import { useRef, useState, useCallback } from 'react'
import { makeBreadcrumb } from '../../utils/breadcrumb'
import {
  getUserPage,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from '../../features/user/api/user'
import { UserRoleConstants } from '../../features/user/types'
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UserRole,
} from '../../features/user/types'

export default function UserList() {
  const actionRef = useRef<ActionType>(null)
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<UserResponse>()

  const { message: messageApi } = App.useApp()

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  // 处理表格请求
  const handleTableRequest = useCallback(
    async (params: Record<string, unknown>, sort: Record<string, unknown>) => {
      const { current, pageSize, username, role } = params

      let sortField: string | undefined
      let sortOrder: 'asc' | 'desc' | undefined

      const sortEntries = Object.entries(sort || {}).filter(([, v]) => v)
      if (sortEntries.length > 0) {
        const [field, order] = sortEntries[0]
        sortField = field
        if (order === 'ascend') sortOrder = 'asc'
        else if (order === 'descend') sortOrder = 'desc'
      }

      const requestParams = {
        page: typeof current === 'number' ? current : undefined,
        size: typeof pageSize === 'number' ? pageSize : undefined,
        username: typeof username === 'string' ? username : undefined,
        role: typeof role === 'string' ? (role as UserRole) : undefined,
        sortField,
        sortOrder,
      }

      try {
        const response = await getUserPage(requestParams)

        return {
          data: response.data.data.content || [],
          success: true,
          total: response.data.data.total || 0,
        }
      } catch {
        return {
          data: [],
          success: false,
          total: 0,
        }
      }
    },
    [],
  )

  // 创建用户
  const handleCreate = async (values: CreateUserRequest) => {
    try {
      await createUserMutation.mutateAsync(values)
      messageApi.success('新建成功')
      setCreateModalVisible(false)
      actionRef.current?.reload()
      return true
    } catch (error) {
      console.error('新建用户失败:', error)
      return false
    }
  }

  // 更新用户
  const handleUpdate = async (values: UpdateUserRequest) => {
    if (!currentRow) return false

    try {
      await updateUserMutation.mutateAsync({
        id: currentRow.id,
        data: values,
      })
      messageApi.success('更新成功')
      setUpdateModalVisible(false)
      setCurrentRow(undefined)
      actionRef.current?.reload()
      return true
    } catch (error) {
      console.error('更新用户失败:', error)
      return false
    }
  }

  // 删除用户
  const handleDelete = async (id: number) => {
    try {
      await deleteUserMutation.mutateAsync(id)
      messageApi.success('删除成功')
      actionRef.current?.reload()
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  }

  const columns: ProColumns<UserResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 48,
      search: false,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入用户名',
          },
        ],
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: {
        [UserRoleConstants.ADMIN]: { text: '管理员', status: 'Success' },
        [UserRoleConstants.MEMBER]: { text: '普通成员', status: 'Default' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 82,
      fixed: 'right',
      render: (_, record) => [
        <a
          key="editable"
          onClick={() => {
            setCurrentRow(record)
            setUpdateModalVisible(true)
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除此用户吗？"
          onConfirm={() => handleDelete(record.id)}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <PageContainer
      breadcrumb={makeBreadcrumb([
        { href: '/settings', title: '系统设置' },
        { href: '/system/users', title: '用户管理' },
      ])}
    >
      <ProTable<UserResponse>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true)
            }}
          >
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        request={handleTableRequest}
        columns={columns}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      <ModalForm<CreateUserRequest>
        title="新建用户"
        width="400px"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        autoComplete="off"
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={handleCreate}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
            {
              min: 3,
              message: '用户名至少3个字符',
            },
          ]}
          name="username"
          label="用户名"
          fieldProps={{
            autoComplete: 'off',
          }}
        />
        <ProFormText.Password
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
            {
              min: 6,
              message: '密码至少6个字符',
            },
          ]}
          name="password"
          label="密码"
          fieldProps={{
            autoComplete: 'new-password',
          }}
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择角色',
            },
          ]}
          name="role"
          label="角色"
          options={[
            { label: '管理员', value: UserRoleConstants.ADMIN },
            { label: '普通成员', value: UserRoleConstants.MEMBER },
          ]}
          initialValue={UserRoleConstants.MEMBER}
        />
      </ModalForm>

      <ModalForm<UpdateUserRequest>
        title="编辑用户"
        width="400px"
        open={updateModalVisible}
        onOpenChange={setUpdateModalVisible}
        initialValues={currentRow}
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={handleUpdate}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
            {
              min: 3,
              message: '用户名至少3个字符',
            },
          ]}
          name="username"
          label="用户名"
        />
        <ProFormText.Password
          name="password"
          label="密码"
          placeholder="不修改密码请留空，密码不会显示在界面上"
          tooltip="密码修改后将立即生效，留空表示保持原密码不变"
          rules={[
            {
              min: 6,
              message: '密码至少6个字符',
            },
          ]}
          fieldProps={{
            autoComplete: 'new-password',
          }}
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择角色',
            },
          ]}
          name="role"
          label="角色"
          options={[
            { label: '管理员', value: UserRoleConstants.ADMIN },
            { label: '普通成员', value: UserRoleConstants.MEMBER },
          ]}
        />
      </ModalForm>
    </PageContainer>
  )
}
