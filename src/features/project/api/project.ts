import request from '../../../utils/request'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectPageRequest,
  ProjectPageResponse,
  GetProjectByNoRequest,
  ValidateProjectNoRequest,
} from '../types'
import type { ApiResponse } from '../../../types/api'

/**
 * 项目管理 API 服务
 */

/** 获取所有项目列表 */
export const getAllProjects = () => {
  return request.get<ApiResponse<ProjectResponse[]>>('/projects')
}

/** 获取所有项目列表 Hook */
export const useAllProjects = () => {
  return useQuery({
    queryKey: ['projects', 'all'],
    queryFn: getAllProjects,
  })
}

/** 分页查询项目列表 */
export const getProjectPage = (params?: ProjectPageRequest) => {
  return request.get<ApiResponse<ProjectPageResponse>>('/projects/page', { params })
}

/** 分页查询项目列表 Hook */
export const useProjectPage = (params?: ProjectPageRequest) => {
  return useQuery({
    queryKey: ['projects', 'page', params],
    queryFn: () => getProjectPage(params),
  })
}

/** 根据ID查询项目 */
export const getProjectById = (id: number) => {
  return request.get<ApiResponse<ProjectResponse>>(`/projects/${id}`)
}

/** 根据ID查询项目 Hook */
export const useProjectById = (id: number) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => getProjectById(id),
    enabled: !!id, // 只有当id存在时才执行查询
  })
}

/** 根据项目编号查询项目 */
export const getProjectByNo = (data: GetProjectByNoRequest) => {
  return request.get<ApiResponse<ProjectResponse>>(`/projects/by-project-no/${data.projectNo}`)
}

/** 根据项目编号查询项目 Hook */
export const useProjectByNo = (projectNo: string) => {
  return useQuery({
    queryKey: ['projects', 'by-no', projectNo],
    queryFn: () => getProjectByNo({ projectNo }),
    enabled: !!projectNo, // 只有当projectNo存在时才执行查询
  })
}

/** 验证项目编号唯一性 */
export const validateProjectNo = (data: ValidateProjectNoRequest) => {
  return request.get<ApiResponse<boolean>>(`/projects/validate-unique/${data.projectNo}`)
}

/** 验证项目编号唯一性 Hook */
export const useValidateProjectNo = (projectNo: string) => {
  return useQuery({
    queryKey: ['projects', 'validate-unique', projectNo],
    queryFn: () => validateProjectNo({ projectNo }),
    enabled: !!projectNo, // 只有当projectNo存在时才执行查询
  })
}

/** 创建新项目 */
export const createProject = (data: CreateProjectRequest) => {
  return request.post<ApiResponse<ProjectResponse>>('/projects', data)
}

/** 创建新项目 Hook */
export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // 创建成功后，使相关的查询缓存失效，重新获取数据
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

/** 更新项目信息 */
export const updateProject = (id: number, data: UpdateProjectRequest) => {
  return request.put<ApiResponse<ProjectResponse>>(`/projects/${id}`, data)
}

/** 更新项目信息 Hook */
export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectRequest }) =>
      updateProject(id, data),
    onSuccess: () => {
      // 更新成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

/** 删除项目 */
export const deleteProject = (id: number) => {
  return request.delete<ApiResponse<void>>(`/projects/${id}`)
}

/** 删除项目 Hook */
export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      // 删除成功后，使相关的查询缓存失效
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
