import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import {
  ModalForm,
  PageContainer,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Popconfirm, Tag, Tooltip, App } from 'antd'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import {
  getOilSamplePage,
  useCreateOilSample,
  useDeleteOilSample,
  useUpdateOilSample,
  validateSampleNo,
  useEnableOilSample,
  useDisableOilSample,
} from '../../features/oil-sample/api/oil-sample'
import {
  OilParameterKeyConstants,
  OilSampleEnabledConstants,
  OilSampleUsageConstants,
} from '../../features/oil-sample/types'
import type {
  CreateOilSampleRequest,
  OilSampleResponse,
  UpdateOilSampleRequest,
} from '../../features/oil-sample/types'

const usageOptions = [
  { label: '清洗用', value: OilSampleUsageConstants.CLEANING },
  { label: '标定用', value: OilSampleUsageConstants.CALIBRATION },
  { label: '出厂测试', value: OilSampleUsageConstants.FACTORY_TEST },
  { label: '交叉灵敏度测试', value: OilSampleUsageConstants.CROSS_SENSITIVITY_TEST },
]

const enabledOptions = [
  { label: '启用', value: OilSampleEnabledConstants.ENABLED, color: 'success' },
  { label: '禁用', value: OilSampleEnabledConstants.DISABLED, color: 'default' },
]

const parameterKeyOptions = [
  { label: 'CH4', value: OilParameterKeyConstants.CH4 },
  { label: 'C2H2', value: OilParameterKeyConstants.C2H2 },
  { label: 'C2H4', value: OilParameterKeyConstants.C2H4 },
  { label: 'C2H6', value: OilParameterKeyConstants.C2H6 },
  { label: 'H2', value: OilParameterKeyConstants.H2 },
  { label: 'CO', value: OilParameterKeyConstants.CO },
  { label: 'CO2', value: OilParameterKeyConstants.CO2 },
  { label: 'H2O', value: OilParameterKeyConstants.H2O },
]

export default function OilSampleList() {
  const actionRef = useRef<ActionType>(null)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [currentRow, setCurrentRow] = useState<OilSampleResponse>()
  const { message: messageApi } = App.useApp()

  const createMutation = useCreateOilSample()
  const updateMutation = useUpdateOilSample()
  const deleteMutation = useDeleteOilSample()
  const enableMutation = useEnableOilSample()
  const disableMutation = useDisableOilSample()

  const columns: ProColumns<OilSampleResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      search: false,
      hideInForm: true,
      fixed: 'left',
    },
    {
      title: '油样编号',
      dataIndex: 'sampleNo',
      ellipsis: true,
      width: 120,
      formItemProps: {
        rules: [
          { required: true, message: '请输入油样编号' },
          { max: 50, message: '油样编号最长50个字符' },
        ],
      },
    },
    {
      title: '油样名称',
      dataIndex: 'sampleName',
      ellipsis: true,
      width: 150,
      formItemProps: {
        rules: [
          { required: true, message: '请输入油样名称' },
          { max: 200, message: '油样名称最长200个字符' },
        ],
      },
    },
    {
      title: '用途',
      dataIndex: 'usage',
      valueType: 'select',
      width: 120,
      fieldProps: {
        options: usageOptions,
      },
      render: (_, record) => {
        const usage = usageOptions.find((u) => u.value === record.usage)
        return usage?.label || record.usage
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择用途' }],
      },
    },
    {
      title: '参数',
      dataIndex: 'parameters',
      width: 150,
      search: false,
      hideInForm: true,
      render: (_, record) => {
        if (!record.parameters?.length) return '-'
        const shown = record.parameters.slice(0, 3)
        const restCount = record.parameters.length - shown.length

        const tags = shown.map((p) => (
          <Tag key={`${p.key}:${p.value}`}>
            {p.key}:{p.value}
          </Tag>
        ))

        if (restCount <= 0) return tags

        return (
          <Tooltip
            title={
              <div>
                {record.parameters.map((p) => (
                  <div key={`${p.key}:${p.value}`}>
                    {p.key}:{p.value}
                  </div>
                ))}
              </div>
            }
          >
            <span>
              {tags}
              <Tag>+{restCount}</Tag>
            </span>
          </Tooltip>
        )
      },
    },
    {
      title: '油缸编号',
      dataIndex: 'cylinderNo',
      valueType: 'digit',
      width: 100,
      formItemProps: {
        rules: [{ required: true, message: '请输入油缸编号' }],
      },
    },
    {
      title: '离线测试时间',
      dataIndex: 'offlineTestedAt',
      valueType: 'dateTime',
      width: 180,
      search: false,
      hideInForm: true,
    },
    {
      title: '离线测试编号',
      dataIndex: 'offlineTestNo',
      ellipsis: true,
      width: 120,
      search: false,
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      valueType: 'select',
      width: 80,
      fieldProps: {
        options: enabledOptions.map(({ label, value }) => ({ label, value })),
      },
      render: (_, record) => {
        const enabled = enabledOptions.find((s) => s.value === record.enabled)
        return enabled ? (
          <Tag color={enabled.color}>{enabled.label}</Tag>
        ) : record.enabled ? (
          '启用'
        ) : (
          '禁用'
        )
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择状态' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      width: 150,
      search: false,
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 180,
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
        record.enabled ? (
          <Popconfirm
            key="disable"
            title="确定要禁用此油样吗？"
            onConfirm={async () => {
              try {
                await disableMutation.mutateAsync(record.id)
                messageApi.success('禁用成功')
                actionRef.current?.reload()
              } catch (error) {
                console.error('禁用失败:', error)
              }
            }}
          >
            <a>禁用</a>
          </Popconfirm>
        ) : (
          <Popconfirm
            key="enable"
            title="确定要启用此油样吗？"
            onConfirm={async () => {
              try {
                await enableMutation.mutateAsync(record.id)
                messageApi.success('启用成功')
                actionRef.current?.reload()
              } catch (error) {
                console.error('启用失败:', error)
              }
            }}
          >
            <a>启用</a>
          </Popconfirm>
        ),
        <Popconfirm
          key="delete"
          title="确定要删除此油样吗？"
          onConfirm={async () => {
            try {
              await deleteMutation.mutateAsync(record.id)
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
      <ProTable<OilSampleResponse>
        headerTitle="油样列表"
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
            <PlusOutlined /> 新建油样
          </Button>,
        ]}
        scroll={{ x: 'max-content' }}
        request={async (params, sort) => {
          const { current, pageSize, ...rest } = params

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
            const res = await getOilSamplePage({
              page: current,
              size: pageSize,
              sampleNo: rest.sampleNo,
              sampleName: rest.sampleName,
              usage: rest.usage,
              enabled: rest.enabled,
              cylinderNo: rest.cylinderNo ? Number(rest.cylinderNo) : undefined,
              sortField,
              sortOrder,
            })
            return {
              data: res.data.data.content,
              success: true,
              total: res.data.data.total,
            }
          } catch (error) {
            console.error('查询油样列表失败:', error)
            return {
              data: [],
              success: false,
              total: 0,
            }
          }
        }}
        columns={columns}
      />

      <ModalForm<CreateOilSampleRequest>
        title="新建油样"
        width="720px"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        autoComplete="off"
        modalProps={{
          destroyOnHidden: true,
        }}
        initialValues={{
          enabled: OilSampleEnabledConstants.ENABLED,
          usage: OilSampleUsageConstants.CALIBRATION,
          parameters: [],
        }}
        onFinish={async (value) => {
          try {
            // 统一处理日期格式：转为 ISO8601 (保留本地时区)
            if (value.offlineTestedAt) {
              const dateValue = value.offlineTestedAt
              if (typeof dateValue === 'string') {
                // 字符串格式，用 dayjs 转换
                value.offlineTestedAt = dayjs(dateValue).format()
              } else {
                // dayjs 对象，直接转换
                value.offlineTestedAt = (dateValue as dayjs.Dayjs).format()
              }
            }
            await createMutation.mutateAsync(value)
            messageApi.success('新建成功')
            setCreateModalVisible(false)
            actionRef.current?.reload()
            return true
          } catch (error) {
            // 错误已在 request 拦截器中处理，这里只需返回 false 防止弹窗关闭
            console.error('创建油样失败:', error)
            return false
          }
        }}
      >
        <ProFormText
          name="sampleNo"
          label="油样编号"
          placeholder="请输入油样编号"
          rules={[
            { required: true, message: '请输入油样编号' },
            { max: 50, message: '油样编号最长50个字符' },
            {
              validator: async (_, value) => {
                if (!value) return Promise.resolve()
                const res = await validateSampleNo({ sampleNo: value })
                if (res.data.data) return Promise.resolve()
                return Promise.reject(new Error('油样编号已存在'))
              },
            },
          ]}
        />
        <ProFormText
          name="sampleName"
          label="油样名称"
          placeholder="请输入油样名称"
          rules={[
            { required: true, message: '请输入油样名称' },
            { max: 200, message: '油样名称最长200个字符' },
          ]}
        />
        <ProFormSelect
          name="usage"
          label="用途"
          options={usageOptions}
          rules={[{ required: true, message: '请选择用途' }]}
        />
        <ProFormDigit
          name="cylinderNo"
          label="油缸编号"
          min={0}
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: '请输入油缸编号' }]}
        />
        <ProFormDateTimePicker name="offlineTestedAt" label="离线测试时间" />
        <ProFormText name="offlineTestNo" label="离线测试编号" placeholder="可选" />

        <ProFormSelect
          name="enabled"
          label="状态"
          options={enabledOptions.map(({ label, value }) => ({ label, value }))}
          rules={[{ required: true, message: '请选择状态' }]}
        />

        <ProFormList
          name="parameters"
          label="参数列表"
          creatorButtonProps={{
            creatorButtonText: '添加参数',
          }}
          copyIconProps={false}
          deleteIconProps={{ tooltipText: '删除' }}
          itemRender={(dom) => (
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline	', width: '100%' }}>
              <div style={{ flex: 1, minWidth: 0 }}>{dom.listDom}</div>
              <div style={{ flex: 'none', marginTop: 4 }}>{dom.action}</div>
            </div>
          )}
        >
          <div style={{ display: 'flex', width: '100%', gap: 12 }}>
            <ProFormSelect
              name="key"
              label={false}
              options={parameterKeyOptions}
              placeholder="参数名"
              rules={[{ required: true, message: '请选择参数名' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 10, marginBottom: 0 } }}
            />
            <ProFormDigit
              name="value"
              label={false}
              placeholder="参数值"
              rules={[{ required: true, message: '请输入参数值' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 14, marginBottom: 0 } }}
            />
          </div>
        </ProFormList>

        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder="可选"
          rules={[{ max: 500, message: '备注最长500个字符' }]}
        />
      </ModalForm>

      <ModalForm<UpdateOilSampleRequest>
        title="编辑油样"
        width="720px"
        open={updateModalVisible}
        onOpenChange={setUpdateModalVisible}
        autoComplete="off"
        modalProps={{
          destroyOnHidden: true,
        }}
        initialValues={
          currentRow
            ? {
                ...currentRow,
                offlineTestedAt: currentRow.offlineTestedAt
                  ? dayjs(currentRow.offlineTestedAt)
                  : undefined,
              }
            : undefined
        }
        onFinish={async (value) => {
          try {
            if (!currentRow) return true
            // 统一处理日期格式：转为 ISO8601 (保留本地时区)
            if (value.offlineTestedAt) {
              const dateValue = value.offlineTestedAt
              if (typeof dateValue === 'string') {
                value.offlineTestedAt = dayjs(dateValue).format()
              } else {
                value.offlineTestedAt = (dateValue as dayjs.Dayjs).format()
              }
            }
            await updateMutation.mutateAsync({
              id: currentRow.id,
              data: value,
            })
            messageApi.success('更新成功')
            setUpdateModalVisible(false)
            setCurrentRow(undefined)
            actionRef.current?.reload()
            return true
          } catch (error) {
            console.error('更新油样失败:', error)
            return false
          }
        }}
      >
        <ProFormText
          name="sampleNo"
          label="油样编号"
          placeholder="请输入油样编号"
          rules={[
            { required: true, message: '请输入油样编号' },
            { max: 50, message: '油样编号最长50个字符' },
            {
              validator: async (_, value) => {
                if (!value) return Promise.resolve()
                if (currentRow && value === currentRow.sampleNo) return Promise.resolve()
                const res = await validateSampleNo({ sampleNo: value })
                if (res.data.data) return Promise.resolve()
                return Promise.reject(new Error('油样编号已存在'))
              },
            },
          ]}
        />
        <ProFormText
          name="sampleName"
          label="油样名称"
          placeholder="请输入油样名称"
          rules={[
            { required: true, message: '请输入油样名称' },
            { max: 200, message: '油样名称最长200个字符' },
          ]}
        />
        <ProFormSelect
          name="usage"
          label="用途"
          options={usageOptions}
          rules={[{ required: true, message: '请选择用途' }]}
        />
        <ProFormDigit
          name="cylinderNo"
          label="油缸编号"
          min={0}
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: '请输入油缸编号' }]}
        />
        <ProFormDateTimePicker name="offlineTestedAt" label="离线测试时间" />
        <ProFormText name="offlineTestNo" label="离线测试编号" placeholder="可选" />

        <ProFormSelect
          name="enabled"
          label="状态"
          options={enabledOptions.map(({ label, value }) => ({ label, value }))}
          rules={[{ required: true, message: '请选择状态' }]}
        />

        <ProFormList
          name="parameters"
          label="参数列表"
          creatorButtonProps={{
            creatorButtonText: '添加参数',
          }}
          copyIconProps={false}
          deleteIconProps={{ tooltipText: '删除' }}
          itemRender={(dom) => (
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', width: '100%' }}>
              <div style={{ flex: 1, minWidth: 0 }}>{dom.listDom}</div>
              <div style={{ flex: 'none', marginTop: 4 }}>{dom.action}</div>
            </div>
          )}
        >
          <div style={{ display: 'flex', width: '100%', gap: 12 }}>
            <ProFormSelect
              name="key"
              label={false}
              options={parameterKeyOptions}
              placeholder="参数名"
              rules={[{ required: true, message: '请选择参数名' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 10, marginBottom: 0 } }}
            />
            <ProFormDigit
              name="value"
              label={false}
              placeholder="参数值"
              rules={[{ required: true, message: '请输入参数值' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 14, marginBottom: 0 } }}
            />
          </div>
        </ProFormList>

        <ProFormTextArea
          name="remark"
          label="备注"
          placeholder="可选"
          rules={[{ max: 500, message: '备注最长500个字符' }]}
        />
      </ModalForm>
    </PageContainer>
  )
}
