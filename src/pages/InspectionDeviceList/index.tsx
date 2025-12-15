import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Popconfirm, Tag, App } from 'antd'
import { useRef, useState } from 'react'
import {
  getInspectionDevicePage,
  useCreateInspectionDevice,
  useDeleteInspectionDevice,
  useUpdateInspectionDevice,
} from '../../features/inspection-device/api/inspection-device'
import { useAllProjects } from '../../features/project/api/project'
import { DeviceStatusConstants } from '../../features/inspection-device/types'
import type {
  CreateInspectionDeviceRequest,
  InspectionDeviceResponse,
  UpdateInspectionDeviceRequest,
} from '../../features/inspection-device/types'

export default function InspectionDeviceList() {
  const actionRef = useRef<ActionType>(null)
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<InspectionDeviceResponse>()
  const { message: messageApi } = App.useApp()

  const createMutation = useCreateInspectionDevice()
  const updateMutation = useUpdateInspectionDevice()
  const deleteMutation = useDeleteInspectionDevice()

  const { data: projectsData } = useAllProjects()

  const projectOptions =
    projectsData?.data?.data?.map((project) => ({
      label: project.projectName,
      value: project.id,
    })) || []

  const statusOptions = [
    { label: '待检', value: DeviceStatusConstants.PENDING_INSPECTION, color: 'default' },
    { label: '检测中', value: DeviceStatusConstants.UNDER_INSPECTION, color: 'processing' },
    { label: '标定中', value: DeviceStatusConstants.CALIBRATED, color: 'warning' },
    { label: '出厂合格', value: DeviceStatusConstants.FACTORY_QUALIFIED, color: 'success' },
    { label: '出厂不合格', value: DeviceStatusConstants.FACTORY_UNQUALIFIED, color: 'error' },
    { label: '维修中', value: DeviceStatusConstants.UNDER_REPAIR, color: 'error' },
    { label: '预留状态一', value: DeviceStatusConstants.RESERVED_ONE, color: 'default' },
    { label: '预留状态二', value: DeviceStatusConstants.RESERVED_TWO, color: 'default' },
  ]

  const columns: ProColumns<InspectionDeviceResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 48,
      search: false,
      hideInForm: true,
    },
    {
      title: '设备编号',
      dataIndex: 'deviceNo',
      ellipsis: true,
      search: true,
      hideInForm: true,
    },
    {
      title: '出厂编号',
      dataIndex: 'serialNumber',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入出厂编号',
          },
          {
            max: 100,
            message: '出厂编号最长100个字符',
          },
        ],
      },
    },
    {
      title: '装置型号',
      dataIndex: 'deviceModel',
      ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            max: 100,
            message: '装置型号最长100个字符',
          },
        ],
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入IP地址',
          },
          {
            max: 50,
            message: 'IP地址最长50个字符',
          },
        ],
      },
    },
    {
      title: '端口号',
      dataIndex: 'port',
      width: 80,
      search: false,
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入端口号',
          },
        ],
      },
      initialValue: 102,
    },
    {
      title: '所属项目',
      dataIndex: 'projectId',
      valueType: 'select',
      fieldProps: {
        options: projectOptions,
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择所属项目',
          },
        ],
      },
    },
    {
      title: '项目内部序号',
      dataIndex: 'projectInternalNo',
      width: 100,
      search: false,
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: {
        options: statusOptions,
      },
      render: (_, record) => {
        const status = statusOptions.find((s) => s.value === record.status)
        return status ? <Tag color={status.color}>{status.label}</Tag> : record.status
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      search: false,
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      search: false,
      editable: false,
      hideInForm: true,
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
          title="确定要删除此设备吗？"
          onConfirm={async () => {
            try {
              await deleteMutation.mutateAsync(record.id)
              messageApi.success('删除成功')
              actionRef.current?.reload()
            } catch {
              // Error handling is done in request interceptor usually
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
      <ProTable<InspectionDeviceResponse>
        headerTitle="待检设备列表"
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
            <PlusOutlined /> 新建设备
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
            const res = await getInspectionDevicePage({
              page: current,
              size: pageSize,
              deviceNo: rest.deviceNo,
              serialNumber: rest.serialNumber,
              ip: rest.ip,
              status: rest.status,
              projectId: rest.projectId,
              sortField,
              sortOrder,
            })
            return {
              data: res.data.data.content,
              success: true,
              total: res.data.data.total,
            }
          } catch {
            return {
              data: [],
              success: false,
              total: 0,
            }
          }
        }}
        columns={columns}
      />

      <ModalForm<CreateInspectionDeviceRequest>
        title="新建设备"
        width="500px"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        autoComplete="off"
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (value) => {
          await createMutation.mutateAsync(value)
          messageApi.success('创建成功')
          setCreateModalVisible(false)
          actionRef.current?.reload()
          return true
        }}
        initialValues={{
          port: 102,
          status: DeviceStatusConstants.PENDING_INSPECTION,
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入出厂编号',
            },
            {
              max: 100,
              message: '出厂编号最长100个字符',
            },
          ]}
          name="serialNumber"
          label="出厂编号"
          placeholder="请输入出厂编号"
        />
        <ProFormText
          rules={[
            {
              max: 100,
              message: '装置型号最长100个字符',
            },
          ]}
          name="deviceModel"
          label="装置型号"
          placeholder="请输入装置型号"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入IP地址',
            },
            {
              max: 50,
              message: 'IP地址最长50个字符',
            },
          ]}
          name="ip"
          label="IP地址"
          placeholder="请输入IP地址"
        />
        <ProFormDigit
          rules={[
            {
              required: true,
              message: '请输入端口号',
            },
          ]}
          name="port"
          label="端口号"
          placeholder="请输入端口号"
          min={1}
          max={65535}
          fieldProps={{ precision: 0 }}
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '请选择所属项目',
            },
          ]}
          name="projectId"
          label="所属项目"
          placeholder="请选择所属项目"
          options={projectOptions}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={statusOptions}
          placeholder="请选择状态"
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

      <ModalForm<UpdateInspectionDeviceRequest>
        title="编辑设备"
        width="500px"
        open={updateModalVisible}
        onOpenChange={setUpdateModalVisible}
        initialValues={currentRow}
        modalProps={{
          destroyOnHidden: true,
        }}
        onFinish={async (value) => {
          if (currentRow) {
            await updateMutation.mutateAsync({
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
        <ProFormText name="deviceNo" label="设备编号" disabled tooltip="设备编号不可修改" />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入出厂编号',
            },
            {
              max: 100,
              message: '出厂编号最长100个字符',
            },
          ]}
          name="serialNumber"
          label="出厂编号"
          placeholder="请输入出厂编号"
        />
        <ProFormText
          rules={[
            {
              max: 100,
              message: '装置型号最长100个字符',
            },
          ]}
          name="deviceModel"
          label="装置型号"
          placeholder="请输入装置型号"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入IP地址',
            },
            {
              max: 50,
              message: 'IP地址最长50个字符',
            },
          ]}
          name="ip"
          label="IP地址"
          placeholder="请输入IP地址"
        />
        <ProFormDigit
          rules={[
            {
              required: true,
              message: '请输入端口号',
            },
          ]}
          name="port"
          label="端口号"
          placeholder="请输入端口号"
          min={1}
          max={65535}
          fieldProps={{ precision: 0 }}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={statusOptions}
          placeholder="请选择状态"
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
