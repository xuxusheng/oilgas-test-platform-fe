// ApiResponse 类型直接在需要的文件中导入，避免冗余导出

/**
 * 项目响应接口
 *
 * 用于返回项目公开信息的数据传输对象 (DTO)。
 * 包含项目的完整信息。
 */
export interface ProjectResponse {
  id: number // 项目的唯一标识符
  projectNo: string // 项目编号
  projectName: string // 项目名称
  projectLeader: string // 项目负责人
  remark?: string // 备注信息（可选）
  createdBy?: number // 创建者（可选）
  createdAt?: string // 创建时间（可选）
  updatedBy?: number // 更新者（可选）
  updatedAt?: string // 更新时间（可选）
}

/**
 * 创建项目请求接口
 *
 * POST /api/projects
 * 包含创建新项目所需的所有信息
 */
export interface CreateProjectRequest {
  projectNo: string // 项目编号，必须唯一，最长50个字符
  projectName: string // 项目名称，可以重复，最长200个字符
  projectLeader?: string // 项目负责人，最长100个字符（可选）
  remark?: string // 备注信息，最长500个字符（可选）
}

/**
 * 更新项目请求接口
 *
 * PUT /api/projects/{id}
 * 包含更新项目信息的字段
 */
export interface UpdateProjectRequest {
  projectNo?: string // 项目编号（不可更改，但为完整性保留）
  projectName?: string // 项目名称，最长200个字符
  projectLeader?: string // 项目负责人，最长100个字符
  remark?: string // 备注信息，最长500个字符
}

/**
 * 项目分页查询请求接口
 *
 * GET /api/projects/page
 * 支持按项目编号、项目名称、项目负责人模糊查询
 */
export interface ProjectPageRequest {
  page?: number // 当前页码，默认为 1
  size?: number // 每页记录数，默认为 10，最大 100
  sortField?: string // 排序字段，只允许字母、数字和下划线
  sortOrder?: 'asc' | 'desc' // 排序顺序
  projectNo?: string // 项目编号（模糊查询）
  projectName?: string // 项目名称（模糊查询）
  projectLeader?: string // 项目负责人（模糊查询）
}

/**
 * 项目分页响应接口
 *
 * GET /api/projects/page 响应数据
 */
export interface ProjectPageResponse {
  content: ProjectResponse[] // 项目列表
  total: number // 总记录数
  page: number // 当前页码
  size: number // 每页记录数
}

/**
 * 根据项目编号查询项目请求接口
 *
 * GET /api/projects/by-project-no/{projectNo}
 */
export interface GetProjectByNoRequest {
  projectNo: string // 项目编号
}

/**
 * 验证项目编号唯一性请求接口
 *
 * GET /api/projects/validate-unique/{projectNo}
 */
export interface ValidateProjectNoRequest {
  projectNo: string // 项目编号
}
