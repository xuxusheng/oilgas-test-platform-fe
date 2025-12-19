// 项目功能模块统一导出

// 类型定义
export type {
  ProjectResponse,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectPageRequest,
  ProjectPageResponse,
  GetProjectByNoRequest,
  ValidateProjectNoRequest,
} from './types'

// API 服务
export {
  getAllProjects,
  useAllProjects,
  getProjectPage,
  useProjectPage,
  getProjectById,
  useProjectById,
  getProjectByNo,
  useProjectByNo,
  validateProjectNo,
  useValidateProjectNo,
  createProject,
  useCreateProject,
  updateProject,
  useUpdateProject,
  deleteProject,
  useDeleteProject,
} from './api/project'
