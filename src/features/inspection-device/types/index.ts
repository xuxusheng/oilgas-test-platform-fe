export type { ApiResponse } from '../../../types/api'

/**
 * 设备状态类型
 */
export type DeviceStatus =
  | 'PENDING_INSPECTION' // 待检
  | 'UNDER_INSPECTION' // 检测中
  | 'CALIBRATED' // 标定中
  | 'FACTORY_QUALIFIED' // 出厂合格
  | 'FACTORY_UNQUALIFIED' // 出厂不合格
  | 'UNDER_REPAIR' // 维修中
  | 'RESERVED_ONE' // 预留状态一
  | 'RESERVED_TWO' // 预留状态二

export const DeviceStatusConstants = {
  PENDING_INSPECTION: 'PENDING_INSPECTION' as DeviceStatus, // 待检
  UNDER_INSPECTION: 'UNDER_INSPECTION' as DeviceStatus, // 检测中
  CALIBRATED: 'CALIBRATED' as DeviceStatus, // 标定中
  FACTORY_QUALIFIED: 'FACTORY_QUALIFIED' as DeviceStatus, // 出厂合格
  FACTORY_UNQUALIFIED: 'FACTORY_UNQUALIFIED' as DeviceStatus, // 出厂不合格
  UNDER_REPAIR: 'UNDER_REPAIR' as DeviceStatus, // 维修中
  RESERVED_ONE: 'RESERVED_ONE' as DeviceStatus, // 预留状态一
  RESERVED_TWO: 'RESERVED_TWO' as DeviceStatus, // 预留状态二
}

/**
 * 检测设备响应接口
 *
 * 用于返回检测设备公开信息的数据传输对象 (DTO)。
 * 包含设备的完整信息。
 */
export interface InspectionDeviceResponse {
  id: number // 设备的唯一标识符
  deviceNo?: string // 设备编号（可选）
  serialNumber: string // 出厂编号
  deviceModel?: string // 装置型号（可选）
  ip: string // IP 地址
  port: number // 端口号
  projectId: number // 所属项目ID
  projectInternalNo?: number // 项目内部序号（可选）
  status: DeviceStatus // 设备状态
  remark?: string // 备注信息（可选）
  createdBy?: number // 创建者（可选）
  createdAt?: string // 创建时间（可选）
  updatedBy?: number // 更新者（可选）
  updatedAt?: string // 更新时间（可选）
}

/**
 * 创建检测设备请求接口
 *
 * POST /api/inspection-devices
 * 包含创建新检测设备所需的所有信息
 */
export interface CreateInspectionDeviceRequest {
  serialNumber: string // 出厂编号，必须全局唯一，最长100个字符
  deviceModel?: string // 装置型号，最长100个字符（可选）
  ip: string // IP 地址，必须全局唯一，最长50个字符
  port: number // 端口号，默认102
  projectId: number // 所属项目ID
  status?: DeviceStatus // 设备状态，默认为"待检"
  remark?: string // 备注信息，最长500个字符（可选）
}

/**
 * 更新检测设备请求接口
 *
 * PUT /api/inspection-devices/{id}
 * 包含更新检测设备信息的字段
 */
export interface UpdateInspectionDeviceRequest {
  serialNumber?: string // 出厂编号
  deviceModel?: string // 装置型号
  ip?: string // IP 地址
  port?: number // 端口号
  status?: DeviceStatus // 设备状态
  remark?: string // 备注信息
}

/**
 * 检测设备分页查询请求接口
 *
 * GET /api/inspection-devices/page
 * 支持按设备编号、出厂编号、IP地址模糊查询，以及设备状态和项目ID精确筛选
 */
export interface InspectionDevicePageRequest {
  page?: number // 当前页码，默认为 1
  size?: number // 每页记录数，默认为 10，最大 100
  sortField?: string // 排序字段，只允许字母、数字和下划线
  sortOrder?: 'asc' | 'desc' // 排序顺序
  deviceNo?: string // 设备编号（模糊查询）
  serialNumber?: string // 出厂编号（模糊查询）
  ip?: string // IP地址（模糊查询）
  status?: DeviceStatus // 设备状态（精确匹配）
  projectId?: number // 所属项目ID（精确匹配）
}

/**
 * 检测设备分页响应接口
 *
 * GET /api/inspection-devices/page 响应数据
 */
export interface InspectionDevicePageResponse {
  content: InspectionDeviceResponse[] // 检测设备列表
  total: number // 总记录数
  page: number // 当前页码
  size: number // 每页记录数
}

/**
 * 根据设备编号查询检测设备请求接口
 *
 * GET /api/inspection-devices/by-device-no/{deviceNo}
 */
export interface GetDeviceByNoRequest {
  deviceNo: string // 设备编号
}

/**
 * 验证出厂编号唯一性请求接口
 *
 * GET /api/inspection-devices/validate-serial-number/{serialNumber}
 */
export interface ValidateSerialNumberRequest {
  serialNumber: string // 出厂编号
}

/**
 * 验证IP地址唯一性请求接口
 *
 * GET /api/inspection-devices/validate-ip/{ip}
 */
export interface ValidateIpRequest {
  ip: string // IP地址
}

/**
 * 检测设备恢复请求接口
 *
 * POST /api/inspection-devices/{id}/restore
 * 用于恢复已软删除的设备
 */
export interface RestoreInspectionDeviceRequest {
  id: number // 需要恢复的设备ID
}
