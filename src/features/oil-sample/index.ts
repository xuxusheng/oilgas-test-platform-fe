// 油样功能模块统一导出

// 类型定义
export type {
  OilSampleResponse,
  CreateOilSampleRequest,
  UpdateOilSampleRequest,
  OilSamplePageRequest,
  OilSamplePageResponse,
  GetOilSampleByNoRequest,
  ValidateSampleNoRequest,
  OilSampleUsage,
  OilSampleStatus,
  OilParameterKey,
  ParameterItem,
} from './types'

// 常量
export {
  OilSampleUsageConstants,
  OilSampleStatusConstants,
  OilParameterKeyConstants,
} from './types'

// API 服务
export {
  getAllOilSamples,
  useAllOilSamples,
  getOilSamplePage,
  useOilSamplePage,
  getOilSampleById,
  useOilSampleById,
  getOilSampleByNo,
  useOilSampleByNo,
  validateSampleNo,
  useValidateSampleNo,
  createOilSample,
  useCreateOilSample,
  updateOilSample,
  useUpdateOilSample,
  deleteOilSample,
  useDeleteOilSample,
} from './api/oil-sample'