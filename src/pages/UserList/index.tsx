import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Tag, Space } from 'antd';
import { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: 'Index',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tip: 'Title is too long will be ellipsis',
    formItemProps: {
      rules: [
        {
          required: true,
          message: 'This is required',
        },
      ],
    },
  },
  {
    title: 'Status',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: 'All', status: 'Default' },
      open: {
        text: 'Open',
        status: 'Error',
      },
      closed: {
        text: 'Closed',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: 'Processing',
        status: 'Processing',
      },
    },
  },
  {
    title: 'Labels',
    dataIndex: 'labels',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'Created Time',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: 'Created Time',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
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
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        View
      </a>,
    ],
  },
];

export default function UserList() {
  const actionRef = useRef<ActionType>(null);
  return (
    <PageContainer>
      <ProTable<GithubIssueItem>
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
                number: 1,
                title: 'Fix bug in login',
                labels: [{ name: 'bug', color: 'red' }],
                state: 'open',
                comments: 1,
                created_at: '2023-01-01T00:00:00Z',
                updated_at: '2023-01-01T00:00:00Z',
                url: 'https://github.com',
              },
              {
                id: 2,
                number: 2,
                title: 'Add new feature',
                labels: [{ name: 'feature', color: 'blue' }],
                state: 'closed',
                comments: 2,
                created_at: '2023-01-02T00:00:00Z',
                updated_at: '2023-01-02T00:00:00Z',
                url: 'https://github.com',
              },
            ],
            success: true,
            total: 2,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="Advanced Table"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            New
          </Button>,
        ]}
      />
    </PageContainer>
  );
}
