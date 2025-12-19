// ApiResponse 类型直接在需要的文件中导入，避免冗余导出

/**
 * 油样用途类型
 */
export type OilSampleUsage = 'CLEANING' | 'CALIBRATION' | 'FACTORY_TEST' | 'CROSS_SENSITIVITY_TEST'

/**
 * 油样用途常量
 */
export const OilSampleUsageConstants = {
  /** 清洗用 */
  CLEANING: 'CLEANING' as OilSampleUsage,
  /** 标定用 */
  CALIBRATION: 'CALIBRATION' as OilSampleUsage,
  /** 出厂测试 */
  FACTORY_TEST: 'FACTORY_TEST' as OilSampleUsage,
  /** 交叉灵敏度测试 */
  CROSS_SENSITIVITY_TEST: 'CROSS_SENSITIVITY_TEST' as OilSampleUsage,
}

/**
 * 油样启用状态类型
 */
export type OilSampleEnabled = boolean

/**
 * 油样启用状态常量
 */
export const OilSampleEnabledConstants = {
  /** 启用 */
  ENABLED: true as OilSampleEnabled,
  /** 禁用 */
  DISABLED: false as OilSampleEnabled,
}

/**
 * 检测参数键类型
 */
export type OilParameterKey = 'CH4' | 'C2H2' | 'C2H4' | 'C2H6' | 'H2' | 'CO' | 'CO2' | 'H2O'

/**
 * 检测参数常量
 */
export const OilParameterKeyConstants = {
  /** 甲烷 */
  CH4: 'CH4' as OilParameterKey,
  /** 乙炔 */
  C2H2: 'C2H2' as OilParameterKey,
  /** 乙烯 */
  C2H4: 'C2H4' as OilParameterKey,
  /** 乙烷 */
  C2H6: 'C2H6' as OilParameterKey,
  /** 氢气 */
  H2: 'H2' as OilParameterKey,
  /** 一氧化碳 */
  CO: 'CO' as OilParameterKey,
  /** 二氧化碳 */
  CO2: 'CO2' as OilParameterKey,
  /** 水 */
  H2O: 'H2O' as OilParameterKey,
}

/**
 * 参数项接口
 */
export interface ParameterItem {
  /** 参数名称 */
  key: OilParameterKey | string
  /** 参数值 */
  value: number
}

/**
 * 油样响应接口
 *
 * 用于返回油样公开信息的数据传输对象 (DTO)。
 * 包含油样的完整信息。
 */
export interface OilSampleResponse {
  /** 主键ID */
  id: number
  /** 油样编号 */
  sampleNo: string
  /** 油样名称 */
  sampleName: string
  /** 油样用途 */
  usage: OilSampleUsage | string
  /** 参数列表 */
  parameters: ParameterItem[]
  /** 油缸编号 */
  cylinderNo: number
  /** 离线测试时间（可选） */
  offlineTestedAt?: string
  /** 离线测试编号（可选） */
  offlineTestNo?: string
  /** 是否启用 */
  enabled: boolean
  /** 备注（可选） */
  remark?: string
  /** 创建者（可选） */
  createdBy?: number
  /** 创建时间（可选） */
  createdAt?: string
  /** 更新者（可选） */
  updatedBy?: number
  /** 更新时间（可选） */
  updatedAt?: string
}

/**
 * 创建油样请求接口
 *
 * POST /api/oil-samples
 * 包含创建新油样所需的所有信息
 */
export interface CreateOilSampleRequest {
  /** 油样编号，必须唯一 */
  sampleNo: string
  /** 油样名称 */
  sampleName: string
  /** 用途 */
  usage: OilSampleUsage | string
  /** 参数列表 */
  parameters: ParameterItem[]
  /** 油缸编号 */
  cylinderNo: number
  /** 离线测试时间（可选） */
  offlineTestedAt?: string
  /** 离线测试编号（可选） */
  offlineTestNo?: string
  /** 是否启用 */
  enabled: boolean
  /** 备注（可选） */
  remark?: string
}

/**
 * 更新油样请求接口
 *
 * PUT /api/oil-samples/{id}
 * 包含更新油样信息的字段
 */
export interface UpdateOilSampleRequest {
  /** 油样编号 */
  sampleNo?: string
  /** 油样名称 */
  sampleName?: string
  /** 用途 */
  usage?: OilSampleUsage | string
  /** 参数列表 */
  parameters?: ParameterItem[]
  /** 油缸编号 */
  cylinderNo?: number
  /** 离线测试时间 */
  offlineTestedAt?: string
  /** 离线测试编号 */
  offlineTestNo?: string
  /** 是否启用 */
  enabled?: boolean
  /** 备注 */
  remark?: string
}

/**
 * 油样分页查询请求接口
 *
 * GET /api/oil-samples/page
 * 支持按油样编号、名称、用途、状态等筛选
 */
export interface OilSamplePageRequest {
  /** 当前页码，默认为 1 */
  page?: number
  /** 每页记录数，默认为 10，最大 100 */
  size?: number
  /** 排序字段，只允许字母、数字和下划线 */
  sortField?: string
  /** 排序顺序 */
  sortOrder?: 'asc' | 'desc'
  /** 油样编号（模糊查询） */
  sampleNo?: string
  /** 油样名称（模糊查询） */
  sampleName?: string
  /** 用途筛选 */
  usage?: OilSampleUsage | string
  /** 启用状态筛选 */
  enabled?: boolean
  /** 油缸编号筛选 */
  cylinderNo?: number
}

/**
 * 油样分页响应接口
 *
 * GET /api/oil-samples/page 响应数据
 */
export interface OilSamplePageResponse {
  /** 油样列表 */
  content: OilSampleResponse[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页记录数 */
  size: number
}

/**
 * 根据油样编号查询油样请求接口
 *
 * GET /api/oil-samples/by-sample-no/{sampleNo}
 */
export interface GetOilSampleByNoRequest {
  /** 油样编号 */
  sampleNo: string
}

/**
 * 验证油样编号唯一性请求接口
 *
 * GET /api/oil-samples/validate-unique/{sampleNo}
 */
export interface ValidateSampleNoRequest {
  /** 油样编号 */
  sampleNo: string
}

/**
 * 油样启用/禁用操作请求接口
 *
 * PATCH /api/oil-samples/{id}/enable
 * PATCH /api/oil-samples/{id}/disable
 * PATCH /api/oil-samples/{id}/toggle
 */
export interface OilSampleStatusChangeRequest {
  /** 油样 ID */
  id: number
}
