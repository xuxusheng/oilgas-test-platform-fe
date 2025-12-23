// 测试工位功能模块统一导出

// 类型定义
export type {
  TestStationResponse,
  CreateTestStationRequest,
  UpdateTestStationRequest,
  TestStationPageRequest,
  TestStationPageResponse,
  GetTestStationByNoRequest,
  ValidateStationNoRequest,
  TestStationUsage,
  ValveCommType,
  TestStationParameterRequest,
  TestStationParameterResponse,
  TestStationStatusChangeRequest,
} from './types'

// 常量
export { TestStationUsageConstants, ValveCommTypeConstants } from './types'

// API 服务
export {
  getAllTestStations,
  useAllTestStations,
  getTestStationPage,
  useTestStationPage,
  getTestStationById,
  useTestStationById,
  getTestStationByNo,
  useTestStationByNo,
  validateStationNo,
  useValidateStationNo,
  createTestStation,
  useCreateTestStation,
  updateTestStation,
  useUpdateTestStation,
  deleteTestStation,
  useDeleteTestStation,
  enableTestStation,
  useEnableTestStation,
  disableTestStation,
  useDisableTestStation,
  toggleTestStation,
  useToggleTestStation,
} from './api/test-station'
