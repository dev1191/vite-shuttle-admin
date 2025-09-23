// composables/useSidebarMenu.ts
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteRecordNormalized } from 'vue-router'
import { useRenderIcon } from './useRender'

interface MenuItem {
    name: string
    path: string
    title: string
    role?: string
    icon?: () => globalThis.VNode | null
    children?: MenuItem[]
    order?: number
    hidden?: boolean
}

export function useSidebarMenu(userRole: string) {
    const router = useRouter()

    const sidebarMenu = computed(() => {
        const routes = router.getRoutes()
        const menuItems: MenuItem[] = []

        routes.forEach((route) => {
            if (shouldIncludeRoute(route, userRole)) {
                const menuItem = createMenuItem(route, userRole)
                if (menuItem && !menuItem.hidden) {
                    insertMenuItem(menuItems, menuItem, route.path)
                }
            }
        })

        return sortMenuItems(menuItems)
    })

    function shouldIncludeRoute(route: RouteRecordNormalized, role: string): boolean {
        if (!route.name) return false
        if (route.meta?.hidden) return false

        // ensure only role-based routes
        if (!route.path.includes('[role]') && !route.path.includes(':role')) return false

        const allowedRoles = route.meta?.roles as string[] | undefined
        if (allowedRoles && !allowedRoles.includes(role)) return false

        if (route.name.toString().endsWith('index')) {
            const baseName = route.name.toString().replace(/index$/, '')
            const hasParentRoute = router
                .getRoutes()
                .some((r) => r.name && r.name.toString() === baseName && r !== route)
            if (hasParentRoute) return false
        }

        return true
    }

    function createMenuItem(route: RouteRecordNormalized, role: string): MenuItem | null {
        const routeName = route.name as string

        // prefer meta.title
        let title = route.meta?.title as string
        if (!title) {
            const pathParts = route.path
                .split('/')
                .filter(
                    (part) => part && !part.startsWith(':') && !part.startsWith('[') && part !== 'index',
                )
            title =
                pathParts[pathParts.length - 1]
                    ?.replace(/[\.\-]/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Untitled'
        }

        const actualPath = route.path.replace(/\[role\]/g, role).replace(/:role/g, role)

        return {
            name: routeName,
            path: actualPath,
            title,
            role,
            icon: route.meta?.icon
                ? useRenderIcon(route.meta.icon as string, { style: { fontSize: '24px' } })
                : undefined,
            order: (route.meta?.order as number) || 999,
            hidden: route.meta?.hidden as boolean,
        }
    }

    function insertMenuItem(menuItems: MenuItem[], newItem: MenuItem, routePath: string) {
        const pathSegments = routePath.split('/').filter(Boolean)
        const cleanSegments = pathSegments
            .filter((segment) => !segment.startsWith(':'))
            .filter((segment) => !segment.startsWith('['))
            .filter((segment) => segment !== 'index')

        if (cleanSegments.length <= 1) {
            if (!menuItems.find((item) => item.name === newItem.name)) {
                menuItems.push(newItem)
            }
        } else {
            let currentLevel = menuItems
            let currentPath = `/${newItem.role}`

            for (let i = 0; i < cleanSegments.length - 1; i++) {
                const segment = cleanSegments[i]
                currentPath += `/${segment}`
                const parentKey = `${newItem.role}-${cleanSegments.slice(0, i + 1).join('-')}`

                let parentItem = currentLevel.find(
                    (item) => item.name === parentKey || item.path === currentPath,
                )

                if (!parentItem) {
                    parentItem = {
                        name: parentKey,
                        path: currentPath,
                        title: segment
                            .replace(/[\.\-]/g, ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase()),
                        role: newItem.role,
                        children: [],
                        order: 500,
                    }
                    currentLevel.push(parentItem)
                }

                if (!parentItem.children) parentItem.children = []
                currentLevel = parentItem.children
            }

            if (!currentLevel.find((child) => child.name === newItem.name)) {
                currentLevel.push(newItem)
            }
        }
    }

    function sortMenuItems(items: MenuItem[]): MenuItem[] {
        const sorted = items.sort((a, b) => {
            if (a.order !== b.order) {
                return (a.order || 999) - (b.order || 999)
            }
            return a.title.localeCompare(b.title)
        })

        sorted.forEach((item) => {
            if (item.children && item.children.length > 0) {
                item.children = sortMenuItems(item.children)
            }
        })

        return sorted
    }

    return {
        sidebarMenu,
    }
}
