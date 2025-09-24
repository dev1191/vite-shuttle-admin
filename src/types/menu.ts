export interface MenuItem {
    title: string
    icon?: string
    route?: string
    children?: MenuItem[]
    permission?: string
    badge?: string | number
    divider?: boolean
}

export interface MenuConfig {
    manual: MenuItem[]
    autoGenerate: boolean
    excludePaths?: string[]
}