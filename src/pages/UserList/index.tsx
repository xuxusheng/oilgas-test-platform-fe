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
import {
  useUserPage,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from '../../features/user/api/user'
import { UserRoleConstants } from '../../features/user/types'
import type { CreateUserRequest, UpdateUserRequest, UserResponse, UserRole, UserPageRequest } from '../../features/user/types'

export default function UserList() {
  const actionRef = useRef<ActionType>(null)
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<UserResponse>()
  const [searchParams, setSearchParams] = useState<UserPageRequest>({})

  const { message: messageApi } = App.useApp()

  // 使用 React Query 的 hooks
  const { data, isLoading, error } = useUserPage(searchParams)
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  // 处理表格请求 - 使用 React Query 的数据
  const handleTableRequest = useCallback(async (params: Record<string, unknown>) => {
    const { current, pageSize, username, role, ...sortParams } = params

    // 处理排序
    let sortField: string | undefined
    let sortOrder: 'asc' | 'desc' | undefined

    const sortKeys = Object.keys(sortParams)
    if (sortKeys.length > 0) {
      sortField = sortKeys[0]
      const order = sortParams[sortField]
      if (order === 'ascend') sortOrder = 'asc'
      else if (order === 'descend') sortOrder = 'desc'
    }

    // 更新搜索参数，触发 React Query 重新查询
    setSearchParams({
      page: current,
      size: pageSize,
      username: username as string,
      role: role as UserRole,
      sortField,
      sortOrder,
    })

    // 返回 React Query 的当前数据
    return {
      data: data?.data?.content || [],
      success: !error,
      total: data?.data?.total || 0,
    }
  }, [data, error])

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
      width: 120,
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
    <PageContainer>
      <ProTable<UserResponse>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        loading={isLoading}
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
