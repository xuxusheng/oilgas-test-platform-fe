import request from '../../../utils/request'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ApiResponse,
  InspectionDeviceResponse,
  CreateInspectionDeviceRequest,
  UpdateInspectionDeviceRequest,
  InspectionDevicePageRequest,
  InspectionDevicePageResponse,
  GetDeviceByNoRequest,
  ValidateSerialNumberRequest,
  ValidateIpRequest,
} from '../types'

/**
 * 检测设备管理 API 服务
 */

/** 获取所有检测设备列表 */
export const getAllInspectionDevices = () => {
  return request.get<ApiResponse<InspectionDeviceResponse[]>>('/inspection-devices')
}

/** 获取所有检测设备列表 Hook */
export const useAllInspectionDevices = () => {
  return useQuery({
    queryKey: ['inspection-devices', 'all'],
    queryFn: getAllInspectionDevices,
  })
}

/** 分页查询检测设备列表 */
export const getInspectionDevicePage = (params?: InspectionDevicePageRequest) => {
  return request.get<ApiResponse<InspectionDevicePageResponse>>('/inspection-devices/page', {
    params,
  })
}

/** 分页查询检测设备列表 Hook */
export const useInspectionDevicePage = (params?: InspectionDevicePageRequest) => {
  return useQuery({
    queryKey: ['inspection-devices', 'page', params],
    queryFn: () => getInspectionDevicePage(params),
  })
}

/** 根据ID查询检测设备 */
export const getInspectionDeviceById = (id: number) => {
  return request.get<ApiResponse<InspectionDeviceResponse>>(`/inspection-devices/${id}`)
}

/** 根据ID查询检测设备 Hook */
export const useInspectionDeviceById = (id: number) => {
  return useQuery({
    queryKey: ['inspection-devices', id],
    queryFn: () => getInspectionDeviceById(id),
    enabled: !!id, // 只有当id存在时才执行查询
  })
}

/** 根据设备编号查询检测设备 */
export const getDeviceByNo = (data: GetDeviceByNoRequest) => {
  return request.get<ApiResponse<InspectionDeviceResponse>>(
    `/inspection-devices/by-device-no/${data.deviceNo}`,
  )
}

/** 根据设备编号查询检测设备 Hook */
export const useDeviceByNo = (deviceNo: string) => {
  return useQuery({
    queryKey: ['inspection-devices', 'by-no', deviceNo],
    queryFn: () => getDeviceByNo({ deviceNo }),
    enabled: !!deviceNo, // 只有当deviceNo存在时才执行查询
  })
}

/** 验证出厂编号唯一性 */
export const validateSerialNumber = (data: ValidateSerialNumberRequest) => {
  return request.get<ApiResponse<boolean>>(
    `/inspection-devices/validate-serial-number/${data.serialNumber}`,
  )
}

/** 验证出厂编号唯一性 Hook */
export const useValidateSerialNumber = (serialNumber: string) => {
  return useQuery({
    queryKey: ['inspection-devices', 'validate-serial-number', serialNumber],
    queryFn: () => validateSerialNumber({ serialNumber }),
    enabled: !!serialNumber, // 只有当serialNumber存在时才执行查询
  })
}

/** 验证IP地址唯一性 */
export const validateIp = (data: ValidateIpRequest) => {
  return request.get<ApiResponse<boolean>>(`/inspection-devices/validate-ip/${data.ip}`)
}

/** 验证IP地址唯一性 Hook */
export const useValidateIp = (ip: string) => {
  return useQuery({
    queryKey: ['inspection-devices', 'validate-ip', ip],
    queryFn: () => validateIp({ ip }),
    enabled: !!ip, // 只有当ip存在时才执行查询
  })
}

/** 创建新检测设备 */
export const createInspectionDevice = (data: CreateInspectionDeviceRequest) => {
  return request.post<ApiResponse<InspectionDeviceResponse>>('/inspection-devices', data)
}

/** 创建新检测设备 Hook */
export const useCreateInspectionDevice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createInspectionDevice,
    onSuccess: () => {
      // 创建成功后，使相关的查询缓存失效，重新获取数据
      queryClient.invalidateQueries({ queryKey: ['inspection-devices'] })
    },
  })
}

/** 更新检测设备信息 */
export const updateInspectionDevice = (id: number, data: UpdateInspectionDeviceRequest) => {
  return request.put<ApiResponse<InspectionDeviceResponse>>(`/inspection-devices/${id}`, data)
}

/** 更新检测设备信息 Hook */
export const useUpdateInspectionDevice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInspectionDeviceRequest }) =>
      updateInspectionDevice(id, data),
    onSuccess: () => {
      // 更新成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['inspection-devices'] })
    },
  })
}

/** 删除检测设备 */
export const deleteInspectionDevice = (id: number) => {
  return request.delete<ApiResponse<void>>(`/inspection-devices/${id}`)
}

/** 删除检测设备 Hook */
export const useDeleteInspectionDevice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteInspectionDevice,
    onSuccess: () => {
      // 删除成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['inspection-devices'] })
    },
  })
}
