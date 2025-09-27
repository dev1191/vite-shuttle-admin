// utils/extractRolePaths.ts
export interface MenuNode {
    path: string
    children?: MenuNode[]
}

export function getRoleMenu(routes: any[], role: string): MenuNode[] {
    function walk(items: any[], basePath = ''): MenuNode[] {
        return items
            .map((r) => {
                let fullPath = basePath + (r.path || '')

                // replace [role] with actual role
                fullPath = fullPath.replace(':role', role)

                const children = r.children
                    ? walk(r.children, fullPath + (r.path && !r.path.endsWith('/') ? '/' : ''))
                    : []

                // only keep nodes that contain this role
                if (fullPath.includes(`/${role}/`) || children.length) {
                    return {
                        path: fullPath,
                        children: children.length ? children : undefined,
                    }
                }
                return null
            })
            .filter(Boolean) as MenuNode[]
    }

    return walk(routes)
}
