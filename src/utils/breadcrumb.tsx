import type { BreadcrumbProps } from 'antd'
import { Link } from 'react-router-dom'
import { ROUTES } from '../router/routes'

type BreadcrumbItem = NonNullable<BreadcrumbProps['items']>[number]

const ROUTABLE_PATHS = new Set<string>(['/', ...Object.values(ROUTES)])

export const makeBreadcrumb = (items: BreadcrumbItem[]): BreadcrumbProps => ({
  items,
  itemRender: (route, _params, routes) => {
    const title = route.title ?? route.breadcrumbName
    if (!title) return null

    const isLast = route === routes[routes.length - 1]
    if (isLast || !route.href || !ROUTABLE_PATHS.has(route.href)) return <span>{title}</span>

    return <Link to={route.href}>{title}</Link>
  },
})
