/**
 * 路由常量定义
 * 统一管理所有路由路径，避免硬编码和不一致
 * 优化：与菜单配置保持一致，使用更清晰的路径结构
 */

export const ROUTES = {
  // 认证路由
  LOGIN: '/login',
  REGISTER: '/register',
  INIT_ADMIN: '/init-admin',

  // 仪表盘
  DASHBOARD: '/dashboard',

  // 测试线管理
  PROJECTS: '/test-line/projects',
  INSPECTION_DEVICES: '/test-line/devices',
  TEST_STATIONS: '/test-line/stations',

  // 样品管理
  OIL_SAMPLES: '/sample/oil-samples',

  // 系统管理
  USERS: '/system/users',
} as const

/**
 * 路由分组定义
 * 便于按功能模块管理路由
 */
export const ROUTE_GROUPS = {
  AUTH: [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.INIT_ADMIN],
  DASHBOARD: [ROUTES.DASHBOARD],
  TEST_LINE: [ROUTES.PROJECTS, ROUTES.INSPECTION_DEVICES, ROUTES.TEST_STATIONS],
  SAMPLE: [ROUTES.OIL_SAMPLES],
  SYSTEM: [ROUTES.USERS],
} as const

/**
 * 获取路由路径的辅助函数
 * 支持参数替换
 */
export const getPath = (
  key: keyof typeof ROUTES,
  params?: Record<string, string | number>,
): string => {
  let path: string = ROUTES[key]

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
