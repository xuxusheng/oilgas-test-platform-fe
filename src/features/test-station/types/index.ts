// ApiResponse 类型直接在需要的文件中导入，避免冗余导出

/**
 * 工位用途类型
 */
export type TestStationUsage = 'INHOUSE_TEST' | 'RND_TEST'

/**
 * 工位用途常量
 */
export const TestStationUsageConstants = {
  /** 厂内测试 */
  INHOUSE_TEST: 'INHOUSE_TEST' as TestStationUsage,
  /** 研发测试 */
  RND_TEST: 'RND_TEST' as TestStationUsage,
}

/**
 * 电磁阀通信类型
 */
export type ValveCommType = 'SERIAL_MODBUS' | 'TCP_MODBUS'

/**
 * 电磁阀通信类型常量
 */
export const ValveCommTypeConstants = {
  /** 串口 Modbus */
  SERIAL_MODBUS: 'SERIAL_MODBUS' as ValveCommType,
  /** TCP Modbus */
  TCP_MODBUS: 'TCP_MODBUS' as ValveCommType,
}

/**
 * 测试工位参数条目（请求）
 */
export interface TestStationParameterRequest {
  /** 参数键 */
  key: string
  /** 参数值 */
  value: string
}

/**
 * 测试工位参数条目（响应）
 */
export interface TestStationParameterResponse {
  /** 参数键 */
  key: string
  /** 参数值 */
  value: string
}

/**
 * 测试工位响应接口
 *
 * 用于返回测试工位公开信息的数据传输对象 (DTO)。
 * 包含测试工位的完整信息。
 */
export interface TestStationResponse {
  /** 工位 ID */
  id: number
  /** 工位编号 */
  stationNo: number
  /** 工位名称 */
  stationName: string
  /** 工位用途 */
  usage: TestStationUsage | string
  /** 电磁阀通信类型 */
  valveCommType: ValveCommType | string
  /** 电磁阀控制参数 */
  valveControlParams: TestStationParameterResponse[]
  /** 油-阀对应关系 */
  oilValveMapping: TestStationParameterResponse[]
  /** 责任人 */
  responsiblePerson: string
  /** 是否启用 */
  enabled: boolean
  /** 创建者用户ID（可选） */
  createdBy?: number
  /** 创建时间（可选） */
  createdAt?: string
  /** 更新者用户ID（可选） */
  updatedBy?: number
  /** 更新时间（可选） */
  updatedAt?: string
}

/**
 * 创建测试工位请求接口
 *
 * POST /api/test-stations
 * 包含创建新测试工位所需的所有信息
 */
export interface CreateTestStationRequest {
  /** 工位编号，必须全局唯一 */
  stationNo: number
  /** 工位名称 */
  stationName: string
  /** 工位用途 */
  usage: TestStationUsage | string
  /** 电磁阀通信类型 */
  valveCommType: ValveCommType | string
  /** 电磁阀控制参数 */
  valveControlParams: TestStationParameterRequest[]
  /** 油-阀对应关系 */
  oilValveMapping: TestStationParameterRequest[]
  /** 责任人 */
  responsiblePerson: string
  /** 是否启用 */
  enabled: boolean
}

/**
 * 更新测试工位请求接口
 *
 * PUT /api/test-stations/{id}
 * 包含更新测试工位信息的字段
 */
export interface UpdateTestStationRequest {
  /** 工位编号 */
  stationNo?: number
  /** 工位名称 */
  stationName?: string
  /** 工位用途 */
  usage?: TestStationUsage | string
  /** 电磁阀通信类型 */
  valveCommType?: ValveCommType | string
  /** 电磁阀控制参数 */
  valveControlParams?: TestStationParameterRequest[]
  /** 油-阀对应关系 */
  oilValveMapping?: TestStationParameterRequest[]
  /** 责任人 */
  responsiblePerson?: string
  /** 是否启用 */
  enabled?: boolean
}

/**
 * 测试工位分页查询请求接口
 *
 * GET /api/test-stations/page
 * 支持按工位编号、名称、用途、责任人等筛选
 */
export interface TestStationPageRequest {
  /** 当前页码，默认为 1 */
  page?: number
  /** 每页记录数，默认为 10，最大 100 */
  size?: number
  /** 排序字段，只允许字母、数字和下划线 */
  sortField?: string
  /** 排序顺序 */
  sortOrder?: 'asc' | 'desc'
  /** 工位编号（精确查询） */
  stationNo?: number
  /** 工位名称（模糊查询） */
  stationName?: string
  /** 用途筛选 */
  usage?: TestStationUsage | string
  /** 电磁阀通信类型筛选 */
  valveCommType?: ValveCommType | string
  /** 责任人（模糊查询） */
  responsiblePerson?: string
  /** 是否启用（精确查询） */
  enabled?: boolean
}

/**
 * 测试工位分页响应接口
 *
 * GET /api/test-stations/page 响应数据
 */
export interface TestStationPageResponse {
  /** 测试工位列表 */
  content: TestStationResponse[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页记录数 */
  size: number
}

/**
 * 根据工位编号查询测试工位请求接口
 *
 * GET /api/test-stations/by-station-no/{stationNo}
 */
export interface GetTestStationByNoRequest {
  /** 工位编号 */
  stationNo: number
}

/**
 * 验证工位编号唯一性请求接口
 *
 * GET /api/test-stations/validate-station-no/{stationNo}
 */
export interface ValidateStationNoRequest {
  /** 工位编号 */
  stationNo: number
}

/**
 * 测试工位启用/禁用操作请求接口
 *
 * PATCH /api/test-stations/{id}/enable
 * PATCH /api/test-stations/{id}/disable
 * PATCH /api/test-stations/{id}/toggle
 */
export interface TestStationStatusChangeRequest {
  /** 工位 ID */
  id: number
}
