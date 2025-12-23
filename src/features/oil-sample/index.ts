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
  OilSampleEnabled,
  OilParameterKey,
  ParameterItem,
  OilSampleStatusChangeRequest,
} from './types'

// 常量
export {
  OilSampleUsageConstants,
  OilSampleEnabledConstants,
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
  enableOilSample,
  useEnableOilSample,
  disableOilSample,
  useDisableOilSample,
  toggleOilSample,
  useToggleOilSample,
} from './api/oil-sample'
