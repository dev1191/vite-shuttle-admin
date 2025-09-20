export interface Permission {
    id: string
    name: string
    slug: string;
    description?: string
}

export interface Role {
    id: string
    name: string
    slug: string
    description?: string
    permissions: Permission[]
}


export interface UserProfile {
    id: string
    email: string
    avatar?: string
    roleId: string
    role: string
    permissions: Permission[]
}