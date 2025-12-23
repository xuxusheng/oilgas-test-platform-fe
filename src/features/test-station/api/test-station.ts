import request from '../../../utils/request'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  TestStationResponse,
  CreateTestStationRequest,
  UpdateTestStationRequest,
  TestStationPageRequest,
  TestStationPageResponse,
  GetTestStationByNoRequest,
  ValidateStationNoRequest,
} from '../types'
import type { ApiResponse } from '../../../types/api'

/**
 * 测试工位管理 API 服务
 */

/** 获取所有测试工位列表 */
export const getAllTestStations = () => {
  return request.get<ApiResponse<TestStationResponse[]>>('/test-stations')
}

/** 获取所有测试工位列表 Hook */
export const useAllTestStations = () => {
  return useQuery({
    queryKey: ['test-stations', 'all'],
    queryFn: getAllTestStations,
  })
}

/** 分页查询测试工位列表 */
export const getTestStationPage = (params?: TestStationPageRequest) => {
  return request.get<ApiResponse<TestStationPageResponse>>('/test-stations/page', { params })
}

/** 分页查询测试工位列表 Hook */
export const useTestStationPage = (params?: TestStationPageRequest) => {
  return useQuery({
    queryKey: ['test-stations', 'page', params],
    queryFn: () => getTestStationPage(params),
  })
}

/** 根据ID查询测试工位 */
export const getTestStationById = (id: number) => {
  return request.get<ApiResponse<TestStationResponse>>(`/test-stations/${id}`)
}

/** 根据ID查询测试工位 Hook */
export const useTestStationById = (id: number) => {
  return useQuery({
    queryKey: ['test-stations', id],
    queryFn: () => getTestStationById(id),
    enabled: !!id, // 只有当id存在时才执行查询
  })
}

/** 根据工位编号查询测试工位 */
export const getTestStationByNo = (data: GetTestStationByNoRequest) => {
  return request.get<ApiResponse<TestStationResponse>>(`/test-stations/by-station-no/${data.stationNo}`)
}

/** 根据工位编号查询测试工位 Hook */
export const useTestStationByNo = (stationNo: number) => {
  return useQuery({
    queryKey: ['test-stations', 'by-no', stationNo],
    queryFn: () => getTestStationByNo({ stationNo }),
    enabled: !!stationNo, // 只有当stationNo存在时才执行查询
  })
}

/** 验证工位编号唯一性 */
export const validateStationNo = (data: ValidateStationNoRequest) => {
  return request.get<ApiResponse<boolean>>(`/test-stations/validate-station-no/${data.stationNo}`)
}

/** 验证工位编号唯一性 Hook */
export const useValidateStationNo = (stationNo: number) => {
  return useQuery({
    queryKey: ['test-stations', 'validate-station-no', stationNo],
    queryFn: () => validateStationNo({ stationNo }),
    enabled: !!stationNo, // 只有当stationNo存在时才执行查询
  })
}

/** 创建新测试工位 */
export const createTestStation = (data: CreateTestStationRequest) => {
  return request.post<ApiResponse<TestStationResponse>>('/test-stations', data)
}

/** 创建新测试工位 Hook */
export const useCreateTestStation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTestStation,
    onSuccess: () => {
      // 创建成功后，使相关的查询缓存失效，重新获取数据
      queryClient.invalidateQueries({ queryKey: ['test-stations'] })
    },
  })
}

/** 更新测试工位信息 */
export const updateTestStation = (id: number, data: UpdateTestStationRequest) => {
  return request.put<ApiResponse<TestStationResponse>>(`/test-stations/${id}`, data)
}

/** 更新测试工位信息 Hook */
export const useUpdateTestStation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTestStationRequest }) =>
      updateTestStation(id, data),
    onSuccess: () => {
      // 更新成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['test-stations'] })
    },
  })
}

/** 删除测试工位 */
export const deleteTestStation = (id: number) => {
  return request.delete<ApiResponse<void>>(`/test-stations/${id}`)
}

/** 删除测试工位 Hook */
export const useDeleteTestStation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTestStation,
    onSuccess: () => {
      // 删除成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['test-stations'] })
    },
  })
}

/** 启用测试工位 */
export const enableTestStation = (id: number) => {
  return request.patch<ApiResponse<TestStationResponse>>(`/test-stations/${id}/enable`)
}

/** 启用测试工位 Hook */
export const useEnableTestStation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: enableTestStation,
    onSuccess: () => {
      // 启用成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['test-stations'] })
    },
  })
}

/** 禁用测试工位 */
export const disableTestStation = (id: number) => {
  return request.patch<ApiResponse<TestStationResponse>>(`/test-stations/${id}/disable`)
}

/** 禁用测试工位 Hook */
export const useDisableTestStation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: disableTestStation,
    onSuccess: () => {
      // 禁用成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['test-stations'] })
    },
  })
}

/** 切换测试工位启用状态 */
export const toggleTestStation = (id: number) => {
  return request.patch<ApiResponse<TestStationResponse>>(`/test-stations/${id}/toggle`)
}

/** 切换测试工位启用状态 Hook */
export const useToggleTestStation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleTestStation,
    onSuccess: () => {
      // 切换成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['test-stations'] })
    },
  })
}
