import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormDigit,
  ProFormList,
  ProFormSwitch,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Popconfirm, Tag, App, Tooltip } from 'antd'
import { useRef, useState } from 'react'
import {
  getTestStationPage,
  useCreateTestStation,
  useDeleteTestStation,
  useUpdateTestStation,
  validateStationNo,
  useEnableTestStation,
  useDisableTestStation,
} from '../../features/test-station/api/test-station'
import {
  TestStationUsageConstants,
  ValveCommTypeConstants,
} from '../../features/test-station/types'
import type {
  CreateTestStationRequest,
  TestStationResponse,
  UpdateTestStationRequest,
} from '../../features/test-station/types'

const usageOptions = [
  { label: '厂内测试', value: TestStationUsageConstants.INHOUSE_TEST },
  { label: '研发测试', value: TestStationUsageConstants.RND_TEST },
]

const valveCommTypeOptions = [
  { label: '串口 Modbus', value: ValveCommTypeConstants.SERIAL_MODBUS },
  { label: 'TCP Modbus', value: ValveCommTypeConstants.TCP_MODBUS },
]

export default function TestStationList() {
  const actionRef = useRef<ActionType>(null)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [currentRow, setCurrentRow] = useState<TestStationResponse>()
  const { message: messageApi } = App.useApp()

  const createMutation = useCreateTestStation()
  const updateMutation = useUpdateTestStation()
  const deleteMutation = useDeleteTestStation()
  const enableMutation = useEnableTestStation()
  const disableMutation = useDisableTestStation()

  // 工位编号验证器 - 用于创建和编辑表单
  const createStationNoValidator =
    (currentStationNo?: number) => async (_rule: unknown, value?: number) => {
      if (!value) return Promise.resolve()
      if (currentStationNo && value === currentStationNo) return Promise.resolve()
      const res = await validateStationNo({ stationNo: value })
      if (res.data.data) return Promise.resolve()
      return Promise.reject(new Error('工位编号已存在'))
    }

  const columns: ProColumns<TestStationResponse>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      search: false,
      hideInForm: true,
      fixed: 'left',
    },
    {
      title: '工位编号',
      dataIndex: 'stationNo',
      valueType: 'digit',
      width: 100,
      formItemProps: {
        rules: [
          { required: true, message: '请输入工位编号' },
          { type: 'number', min: 1, message: '工位编号必须大于0' },
        ],
      },
    },
    {
      title: '工位名称',
      dataIndex: 'stationName',
      ellipsis: true,
      width: 150,
      formItemProps: {
        rules: [
          { required: true, message: '请输入工位名称' },
          { max: 100, message: '工位名称最长100个字符' },
        ],
      },
    },
    {
      title: '用途',
      dataIndex: 'usage',
      valueType: 'select',
      width: 100,
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
      title: '电磁阀通信类型',
      dataIndex: 'valveCommType',
      valueType: 'select',
      width: 130,
      fieldProps: {
        options: valveCommTypeOptions,
      },
      render: (_, record) => {
        const type = valveCommTypeOptions.find((t) => t.value === record.valveCommType)
        return type?.label || record.valveCommType
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择电磁阀通信类型' }],
      },
    },
    {
      title: '控制参数',
      dataIndex: 'valveControlParams',
      width: 120,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        if (!record.valveControlParams || record.valveControlParams.length === 0) {
          return (
            <Tooltip title="点击编辑可配置电磁阀控制参数">
              <Tag color="default" style={{ cursor: 'help' }}>
                未配置
              </Tag>
            </Tooltip>
          )
        }
        const paramLines = record.valveControlParams.map((p) => (
          <div key={p.key} style={{ marginBottom: 2 }}>
            <strong>{p.key}:</strong> {p.value}
          </div>
        ))
        return (
          <Tooltip
            title={<div style={{ whiteSpace: 'pre-wrap', maxWidth: 300 }}>{paramLines}</div>}
          >
            <span
              style={{ cursor: 'help', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >
              {record.valveControlParams.length} 个参数
            </span>
          </Tooltip>
        )
      },
    },
    {
      title: '油-阀关系',
      dataIndex: 'oilValveMapping',
      width: 120,
      ellipsis: true,
      search: false,
      render: (_, record) => {
        if (!record.oilValveMapping || record.oilValveMapping.length === 0) {
          return (
            <Tooltip title="点击编辑可配置油-阀对应关系">
              <Tag color="default" style={{ cursor: 'help' }}>
                未配置
              </Tag>
            </Tooltip>
          )
        }
        const mappingLines = record.oilValveMapping.map((p) => (
          <div key={p.key} style={{ marginBottom: 2 }}>
            油<span style={{ color: '#1890ff' }}>{p.key}</span> → 阀
            <span style={{ color: '#52c41a' }}>{p.value}</span>
          </div>
        ))
        return (
          <Tooltip
            title={<div style={{ whiteSpace: 'pre-wrap', maxWidth: 300 }}>{mappingLines}</div>}
          >
            <span
              style={{ cursor: 'help', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >
              {record.oilValveMapping.length} 组映射
            </span>
          </Tooltip>
        )
      },
    },
    {
      title: '责任人',
      dataIndex: 'responsiblePerson',
      ellipsis: true,
      width: 120,
      formItemProps: {
        rules: [
          { required: true, message: '请输入责任人' },
          { max: 50, message: '责任人最长50个字符' },
        ],
      },
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      valueType: 'select',
      width: 80,
      fieldProps: {
        options: [
          { label: '启用', value: true },
          { label: '禁用', value: false },
        ],
      },
      render: (_, record) => {
        return record.enabled ? <Tag color="success">启用</Tag> : <Tag color="default">禁用</Tag>
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择状态' }],
      },
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
            title="确定要禁用此工位吗？"
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
            title="确定要启用此工位吗？"
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
          title="确定要删除此工位吗？"
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
      <ProTable<TestStationResponse>
        headerTitle="测试工位列表"
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
            <PlusOutlined /> 新建工位
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
            const res = await getTestStationPage({
              page: current,
              size: pageSize,
              stationNo: rest.stationNo ? Number(rest.stationNo) : undefined,
              stationName: rest.stationName,
              usage: rest.usage,
              valveCommType: rest.valveCommType,
              responsiblePerson: rest.responsiblePerson,
              enabled: rest.enabled,
              sortField,
              sortOrder,
            })
            return {
              data: res.data.data.content,
              success: true,
              total: res.data.data.total,
            }
          } catch (error) {
            console.error('查询工位列表失败:', error)
            return {
              data: [],
              success: false,
              total: 0,
            }
          }
        }}
        columns={columns}
      />

      <ModalForm<CreateTestStationRequest>
        title="新建工位"
        width="720px"
        open={createModalVisible}
        onOpenChange={setCreateModalVisible}
        autoComplete="off"
        modalProps={{
          destroyOnHidden: true,
        }}
        initialValues={{
          enabled: true,
          usage: TestStationUsageConstants.INHOUSE_TEST,
          valveCommType: ValveCommTypeConstants.SERIAL_MODBUS,
          valveControlParams: [],
          oilValveMapping: [],
        }}
        onFinish={async (value) => {
          try {
            await createMutation.mutateAsync(value)
            messageApi.success('新建成功')
            setCreateModalVisible(false)
            actionRef.current?.reload()
            return true
          } catch (error) {
            console.error('新建工位失败:', error)
            return false
          }
        }}
      >
        <ProFormDigit
          name="stationNo"
          label="工位编号"
          placeholder="请输入工位编号"
          min={1}
          fieldProps={{ precision: 0 }}
          rules={[
            { required: true, message: '请输入工位编号' },
            { validator: createStationNoValidator() },
          ]}
        />
        <ProFormText
          name="stationName"
          label="工位名称"
          placeholder="请输入工位名称"
          rules={[
            { required: true, message: '请输入工位名称' },
            { max: 100, message: '工位名称最长100个字符' },
          ]}
        />
        <ProFormSelect
          name="usage"
          label="用途"
          options={usageOptions}
          rules={[{ required: true, message: '请选择用途' }]}
        />
        <ProFormSelect
          name="valveCommType"
          label="电磁阀通信类型"
          options={valveCommTypeOptions}
          rules={[{ required: true, message: '请选择电磁阀通信类型' }]}
        />
        <ProFormText
          name="responsiblePerson"
          label="责任人"
          placeholder="请输入责任人"
          rules={[
            { required: true, message: '请输入责任人' },
            { max: 50, message: '责任人最长50个字符' },
          ]}
        />
        <ProFormSwitch
          name="enabled"
          label="是否启用"
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />

        <ProFormList
          name="valveControlParams"
          label="电磁阀控制参数"
          creatorButtonProps={{
            creatorButtonText: '添加控制参数',
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
            <ProFormText
              name="key"
              label={false}
              placeholder="参数键"
              rules={[{ required: true, message: '请输入参数键' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 10, marginBottom: 0 } }}
            />
            <ProFormText
              name="value"
              label={false}
              placeholder="参数值"
              rules={[{ required: true, message: '请输入参数值' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 14, marginBottom: 0 } }}
            />
          </div>
        </ProFormList>

        <ProFormList
          name="oilValveMapping"
          label="油-阀对应关系"
          creatorButtonProps={{
            creatorButtonText: '添加对应关系',
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
            <ProFormText
              name="key"
              label={false}
              placeholder="油样编号"
              rules={[{ required: true, message: '请输入油样编号' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 10, marginBottom: 0 } }}
            />
            <ProFormText
              name="value"
              label={false}
              placeholder="阀门编号"
              rules={[{ required: true, message: '请输入阀门编号' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 14, marginBottom: 0 } }}
            />
          </div>
        </ProFormList>
      </ModalForm>

      <ModalForm<UpdateTestStationRequest>
        title="编辑工位"
        width="720px"
        open={updateModalVisible}
        onOpenChange={setUpdateModalVisible}
        autoComplete="off"
        modalProps={{
          destroyOnHidden: true,
        }}
        initialValues={currentRow}
        onFinish={async (value) => {
          try {
            if (!currentRow) return true
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
            console.error('更新工位失败:', error)
            return false
          }
        }}
      >
        <ProFormDigit
          name="stationNo"
          label="工位编号"
          placeholder="请输入工位编号"
          min={1}
          fieldProps={{ precision: 0 }}
          rules={[
            { required: true, message: '请输入工位编号' },
            { validator: createStationNoValidator(currentRow?.stationNo) },
          ]}
        />
        <ProFormText
          name="stationName"
          label="工位名称"
          placeholder="请输入工位名称"
          rules={[
            { required: true, message: '请输入工位名称' },
            { max: 100, message: '工位名称最长100个字符' },
          ]}
        />
        <ProFormSelect
          name="usage"
          label="用途"
          options={usageOptions}
          rules={[{ required: true, message: '请选择用途' }]}
        />
        <ProFormSelect
          name="valveCommType"
          label="电磁阀通信类型"
          options={valveCommTypeOptions}
          rules={[{ required: true, message: '请选择电磁阀通信类型' }]}
        />
        <ProFormText
          name="responsiblePerson"
          label="责任人"
          placeholder="请输入责任人"
          rules={[
            { required: true, message: '请输入责任人' },
            { max: 50, message: '责任人最长50个字符' },
          ]}
        />
        <ProFormSwitch
          name="enabled"
          label="是否启用"
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />

        <ProFormList
          name="valveControlParams"
          label="电磁阀控制参数"
          creatorButtonProps={{
            creatorButtonText: '添加控制参数',
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
            <ProFormText
              name="key"
              label={false}
              placeholder="参数键"
              rules={[{ required: true, message: '请输入参数键' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 10, marginBottom: 0 } }}
            />
            <ProFormText
              name="value"
              label={false}
              placeholder="参数值"
              rules={[{ required: true, message: '请输入参数值' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 14, marginBottom: 0 } }}
            />
          </div>
        </ProFormList>

        <ProFormList
          name="oilValveMapping"
          label="油-阀对应关系"
          creatorButtonProps={{
            creatorButtonText: '添加对应关系',
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
            <ProFormText
              name="key"
              label={false}
              placeholder="油样编号"
              rules={[{ required: true, message: '请输入油样编号' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 10, marginBottom: 0 } }}
            />
            <ProFormText
              name="value"
              label={false}
              placeholder="阀门编号"
              rules={[{ required: true, message: '请输入阀门编号' }]}
              fieldProps={{ style: { width: '100%' } }}
              formItemProps={{ style: { flex: 14, marginBottom: 0 } }}
            />
          </div>
        </ProFormList>
      </ModalForm>
    </PageContainer>
  )
}
