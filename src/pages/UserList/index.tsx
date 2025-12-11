import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import {
  getUserPage,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from '../../features/user/api/user';
import { UserRoleConstants } from '../../features/user/types';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../../features/user/types';

export default function UserList() {
  const actionRef = useRef<ActionType>(null);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<UserResponse>();

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

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
            setCurrentRow(record);
            setUpdateModalVisible(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除此用户吗？"
          onConfirm={async () => {
            try {
              await deleteUserMutation.mutateAsync(record.id);
              message.success('删除成功');
              actionRef.current?.reload();
            } catch (error) {
              // Error handling is done in request interceptor usually, but good to have here too if needed
            }
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
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
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        request={async (params, sort, _filter) => {
          const { current, pageSize, ...rest } = params;

          // Handle sorting
          let sortField: string | undefined;
          let sortOrder: 'asc' | 'desc' | undefined;

          const sortKeys = Object.keys(sort);
          if (sortKeys.length > 0) {
            sortField = sortKeys[0];
            const order = sort[sortField];
            if (order === 'ascend') sortOrder = 'asc';
            else if (order === 'descend') sortOrder = 'desc';
          }

          try {
            const res = await getUserPage({
              page: current,
              size: pageSize,
              username: rest.username,
              role: rest.role as any,
              sortField,
              sortOrder,
            });
            return {
              data: res.data.data.content,
              success: true,
              total: res.data.data.total,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
      />

      <ModalForm<CreateUserRequest>
        title="新建用户"
        width="400px"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        autoComplete="off"
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async (value) => {
          await createUserMutation.mutateAsync(value);
          message.success('创建成功');
          setCreateModalVisible(false);
          actionRef.current?.reload();
          return true;
        }}
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
          destroyOnClose: true,
        }}
        onFinish={async (value) => {
          if (currentRow) {
            await updateUserMutation.mutateAsync({
              id: currentRow.id,
              data: value,
            });
            message.success('更新成功');
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }
          return true;
        }}
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
          placeholder="留空则不修改"
          rules={[
            {
              min: 6,
              message: '密码至少6个字符',
            },
          ]}
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
  );
}
