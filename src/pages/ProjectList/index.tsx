import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Popconfirm, App } from 'antd'
import { useRef, useState } from 'react'
import {
  getProjectPage,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from '../../features/project/api/project'
import type {
  CreateProjectRequest,
  ProjectResponse,
  UpdateProjectRequest,
} from '../../features/project/types'

export default function ProjectList() {
  const actionRef = useRef<ActionType>(null)
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<ProjectResponse>()
  const { message: messageApi } = App.useApp()

  const createProjectMutation = useCreateProject()
  const updateProjectMutation = useUpdateProject()
  const deleteProjectMutation = useDeleteProject()

  const columns: ProColumns<ProjectResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 48,
      search: false,
      hideInForm: true,
    },
    {
      title: '项目编号',
      dataIndex: 'projectNo',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入项目编号',
          },
          {
            max: 50,
            message: '项目编号最长50个字符',
          },
        ],
      },
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入项目名称',
          },
          {
            max: 200,
            message: '项目名称最长200个字符',
          },
        ],
      },
    },
    {
      title: '项目负责人',
      dataIndex: 'projectLeader',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            max: 100,
            message: '项目负责人最长100个字符',
          },
        ],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      search: false,
      hideInTable: true, // Optional: hide in table if it takes too much space
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      search: false,
      editable: false,
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
          title="确定要删除此项目吗？"
          onConfirm={async () => {
            try {
              await deleteProjectMutation.mutateAsync(record.id)
              messageApi.success('删除成功')
              actionRef.current?.reload()
            } catch (error) {
              console.error('删除失败:', error)
            }
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <PageContainer>
      <ProTable<ProjectResponse>
        headerTitle="项目列表"
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
            <PlusOutlined /> 新建项目
          </Button>,
        ]}
        request={async (params, sort) => {
          const { current, pageSize, ...rest } = params

          // Handle sorting
          let sortField: string | undefined
          let sortOrder: 'asc' | 'desc' | undefined

          const sortKeys = Object.keys(sort)
          if (sortKeys.length > 0) {
            sortField = sortKeys[0]
            const order = sort[sortField]
            if (order === 'ascend') sortOrder = 'asc'
            else if (order === 'descend') sortOrder = 'desc'
          }

          try {
            const res = await getProjectPage({
              page: current,
              size: pageSize,
              projectNo: rest.projectNo,
              projectName: rest.projectName,
              projectLeader: rest.projectLeader,
              sortField,
              sortOrder,
            })
            return {
              data: res.data.data.content,
              success: true,
              total: res.data.data.total,
            }
          } catch (error) {
            console.error('查询项目列表失败:', error)
            return {
              data: [],
              success: false,
              total: 0,
            }
          }
        }}
        columns={columns}
      />

      <ModalForm<CreateProjectRequest>
        title="新建项目"
        width="500px"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        autoComplete="off"
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (value) => {
          await createProjectMutation.mutateAsync(value)
          messageApi.success('创建成功')
          setCreateModalVisible(false)
          actionRef.current?.reload()
          return true
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入项目编号',
            },
            {
              max: 50,
              message: '项目编号最长50个字符',
            },
          ]}
          name="projectNo"
          label="项目编号"
          placeholder="请输入项目编号"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入项目名称',
            },
            {
              max: 200,
              message: '项目名称最长200个字符',
            },
          ]}
          name="projectName"
          label="项目名称"
          placeholder="请输入项目名称"
        />
        <ProFormText
          rules={[
            {
              max: 100,
              message: '项目负责人最长100个字符',
            },
          ]}
          name="projectLeader"
          label="项目负责人"
          placeholder="请输入项目负责人"
        />
        <ProFormTextArea
          rules={[
            {
              max: 500,
              message: '备注最长500个字符',
            },
          ]}
          name="remark"
          label="备注"
          placeholder="请输入备注"
        />
      </ModalForm>

      <ModalForm<UpdateProjectRequest>
        title="编辑项目"
        width="500px"
        open={updateModalVisible}
        onOpenChange={setUpdateModalVisible}
        initialValues={currentRow}
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (value) => {
          if (currentRow) {
            await updateProjectMutation.mutateAsync({
              id: currentRow.id,
              data: value,
            })
            messageApi.success('更新成功')
            setUpdateModalVisible(false)
            setCurrentRow(undefined)
            actionRef.current?.reload()
          }
          return true
        }}
      >
        <ProFormText name="projectNo" label="项目编号" disabled tooltip="项目编号不可修改" />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入项目名称',
            },
            {
              max: 200,
              message: '项目名称最长200个字符',
            },
          ]}
          name="projectName"
          label="项目名称"
          placeholder="请输入项目名称"
        />
        <ProFormText
          rules={[
            {
              max: 100,
              message: '项目负责人最长100个字符',
            },
          ]}
          name="projectLeader"
          label="项目负责人"
          placeholder="请输入项目负责人"
        />
        <ProFormTextArea
          rules={[
            {
              max: 500,
              message: '备注最长500个字符',
            },
          ]}
          name="remark"
          label="备注"
          placeholder="请输入备注"
        />
      </ModalForm>
    </PageContainer>
  )
}
