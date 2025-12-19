import request from '../../../utils/request'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ApiResponse,
  OilSampleResponse,
  CreateOilSampleRequest,
  UpdateOilSampleRequest,
  OilSamplePageRequest,
  OilSamplePageResponse,
  GetOilSampleByNoRequest,
  ValidateSampleNoRequest,
} from '../types'

/**
 * 油样管理 API 服务
 */

/** 获取所有油样列表 */
export const getAllOilSamples = () => {
  return request.get<ApiResponse<OilSampleResponse[]>>('/oil-samples')
}

/** 获取所有油样列表 Hook */
export const useAllOilSamples = () => {
  return useQuery({
    queryKey: ['oil-samples', 'all'],
    queryFn: getAllOilSamples,
  })
}

/** 分页查询油样列表 */
export const getOilSamplePage = (params?: OilSamplePageRequest) => {
  return request.get<ApiResponse<OilSamplePageResponse>>('/oil-samples/page', { params })
}

/** 分页查询油样列表 Hook */
export const useOilSamplePage = (params?: OilSamplePageRequest) => {
  return useQuery({
    queryKey: ['oil-samples', 'page', params],
    queryFn: () => getOilSamplePage(params),
  })
}

/** 根据ID查询油样 */
export const getOilSampleById = (id: number) => {
  return request.get<ApiResponse<OilSampleResponse>>(`/oil-samples/${id}`)
}

/** 根据ID查询油样 Hook */
export const useOilSampleById = (id: number) => {
  return useQuery({
    queryKey: ['oil-samples', id],
    queryFn: () => getOilSampleById(id),
    enabled: !!id, // 只有当id存在时才执行查询
  })
}

/** 根据油样编号查询油样 */
export const getOilSampleByNo = (data: GetOilSampleByNoRequest) => {
  return request.get<ApiResponse<OilSampleResponse>>(`/oil-samples/by-sample-no/${data.sampleNo}`)
}

/** 根据油样编号查询油样 Hook */
export const useOilSampleByNo = (sampleNo: string) => {
  return useQuery({
    queryKey: ['oil-samples', 'by-no', sampleNo],
    queryFn: () => getOilSampleByNo({ sampleNo }),
    enabled: !!sampleNo, // 只有当sampleNo存在时才执行查询
  })
}

/** 验证油样编号唯一性 */
export const validateSampleNo = (data: ValidateSampleNoRequest) => {
  return request.get<ApiResponse<boolean>>(`/oil-samples/validate-unique/${data.sampleNo}`)
}

/** 验证油样编号唯一性 Hook */
export const useValidateSampleNo = (sampleNo: string) => {
  return useQuery({
    queryKey: ['oil-samples', 'validate-unique', sampleNo],
    queryFn: () => validateSampleNo({ sampleNo }),
    enabled: !!sampleNo, // 只有当sampleNo存在时才执行查询
  })
}

/** 创建新油样 */
export const createOilSample = (data: CreateOilSampleRequest) => {
  return request.post<ApiResponse<OilSampleResponse>>('/oil-samples', data)
}

/** 创建新油样 Hook */
export const useCreateOilSample = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOilSample,
    onSuccess: () => {
      // 创建成功后，使相关的查询缓存失效，重新获取数据
      queryClient.invalidateQueries({ queryKey: ['oil-samples'] })
    },
  })
}

/** 更新油样信息 */
export const updateOilSample = (id: number, data: UpdateOilSampleRequest) => {
  return request.put<ApiResponse<OilSampleResponse>>(`/oil-samples/${id}`, data)
}

/** 更新油样信息 Hook */
export const useUpdateOilSample = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOilSampleRequest }) =>
      updateOilSample(id, data),
    onSuccess: () => {
      // 更新成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['oil-samples'] })
    },
  })
}

/** 删除油样 */
export const deleteOilSample = (id: number) => {
  return request.delete<ApiResponse<void>>(`/oil-samples/${id}`)
}

/** 删除油样 Hook */
export const useDeleteOilSample = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOilSample,
    onSuccess: () => {
      // 删除成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['oil-samples'] })
    },
  })
}

/** 启用油样 */
export const enableOilSample = (id: number) => {
  return request.patch<ApiResponse<OilSampleResponse>>(`/oil-samples/${id}/enable`)
}

/** 启用油样 Hook */
export const useEnableOilSample = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: enableOilSample,
    onSuccess: () => {
      // 启用成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['oil-samples'] })
    },
  })
}

/** 禁用油样 */
export const disableOilSample = (id: number) => {
  return request.patch<ApiResponse<OilSampleResponse>>(`/oil-samples/${id}/disable`)
}

/** 禁用油样 Hook */
export const useDisableOilSample = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: disableOilSample,
    onSuccess: () => {
      // 禁用成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['oil-samples'] })
    },
  })
}

/** 切换油样启用状态 */
export const toggleOilSample = (id: number) => {
  return request.patch<ApiResponse<OilSampleResponse>>(`/oil-samples/${id}/toggle`)
}

/** 切换油样启用状态 Hook */
export const useToggleOilSample = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleOilSample,
    onSuccess: () => {
      // 切换成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['oil-samples'] })
    },
  })
}
