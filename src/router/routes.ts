/**
 * 路由常量定义
 * 统一管理所有路由路径，避免硬编码和不一致
 */

export const ROUTES = {
  // 认证路由
  LOGIN: '/login',
  REGISTER: '/register',

  // 仪表盘
  DASHBOARD: '/dashboard',

  // 测试线管理
  OIL_SAMPLES: '/test-line-management/oil-samples',
  TEST_STATIONS: '/test-line-management/test-stations',

  // 设备管理
  INSPECTION_DEVICES: '/device-management/inspection-devices',

  // 系统设置
  PROJECTS: '/settings/projects',
  USERS: '/settings/users',
} as const

/**
 * 路由分组定义
 * 便于按功能模块管理路由
 */
export const ROUTE_GROUPS = {
  AUTH: [ROUTES.LOGIN, ROUTES.REGISTER],
  DASHBOARD: [ROUTES.DASHBOARD],
  TEST_LINE: [ROUTES.OIL_SAMPLES, ROUTES.TEST_STATIONS],
  DEVICE: [ROUTES.INSPECTION_DEVICES],
  SETTINGS: [ROUTES.PROJECTS, ROUTES.USERS],
} as const

/**
 * 获取路由路径的辅助函数
 * 支持参数替换
 */
export const getPath = (key: keyof typeof ROUTES, params?: Record<string, string | number>): string => {
  let path = ROUTES[key]

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value))
    })
  }

  return path
}

/**
 * 检查路径是否属于某个分组
 */
export const isPathInGroup = (path: string, group: keyof typeof ROUTE_GROUPS): boolean => {
  return ROUTE_GROUPS[group].includes(path as never)
}
