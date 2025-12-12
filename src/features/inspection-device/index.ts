// 检测设备功能模块统一导出

// 类型定义
export type {
  InspectionDeviceResponse,
  CreateInspectionDeviceRequest,
  UpdateInspectionDeviceRequest,
  InspectionDevicePageRequest,
  InspectionDevicePageResponse,
  GetDeviceByNoRequest,
  ValidateSerialNumberRequest,
  ValidateIpRequest,
  RestoreInspectionDeviceRequest,
  DeviceStatus,
} from './types'

// 常量
export { DeviceStatusConstants } from './types'

// API 服务
export {
  getAllInspectionDevices,
  useAllInspectionDevices,
  getInspectionDevicePage,
  useInspectionDevicePage,
  getInspectionDeviceById,
  useInspectionDeviceById,
  getDeviceByNo,
  useDeviceByNo,
  validateSerialNumber,
  useValidateSerialNumber,
  validateIp,
  useValidateIp,
  createInspectionDevice,
  useCreateInspectionDevice,
  updateInspectionDevice,
  useUpdateInspectionDevice,
  deleteInspectionDevice,
  useDeleteInspectionDevice,
  restoreInspectionDevice,
  useRestoreInspectionDevice,
} from './api/inspection-device'
