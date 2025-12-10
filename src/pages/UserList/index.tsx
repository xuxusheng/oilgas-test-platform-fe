import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Tag, Space, message } from 'antd';
import { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';

type UserItem = {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
  created_at: string;
};

const columns: ProColumns<UserItem>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Username',
    dataIndex: 'username',
    copyable: true,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'Username is required',
        },
      ],
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    copyable: true,
    ellipsis: true,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    valueType: 'select',
    valueEnum: {
      admin: { text: 'Admin', status: 'Success' },
      user: { text: 'User', status: 'Default' },
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      active: { text: 'Active', status: 'Success' },
      disabled: { text: 'Disabled', status: 'Error' },
    },
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: 'Action',
    valueType: 'option',
    key: 'option',
    render: (_, record, __, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        Edit
      </a>,
      <a
        key="delete"
        onClick={() => {
          message.success('Deleted successfully');
        }}
      >
        Delete
      </a>,
    ],
  },
];

export default function UserList() {
  const actionRef = useRef<ActionType>(null);
  return (
    <PageContainer>
      <ProTable<UserItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (_, sort, filter) => {
          console.log(sort, filter);
          // Mock data request
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return {
            data: [
              {
                id: 1,
                username: 'admin',
                email: 'admin@example.com',
                role: 'admin',
                status: 'active',
                created_at: '2023-01-01T10:00:00Z',
              },
              {
                id: 2,
                username: 'user1',
                email: 'user1@example.com',
                role: 'user',
                status: 'active',
                created_at: '2023-01-02T11:00:00Z',
              },
              {
                id: 3,
                username: 'user2',
                email: 'user2@example.com',
                role: 'user',
                status: 'disabled',
                created_at: '2023-01-03T12:00:00Z',
              },
            ],
            success: true,
            total: 3,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="User List"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            New User
          </Button>,
        ]}
      />
    </PageContainer>
  );
}
