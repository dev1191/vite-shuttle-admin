

export interface Permission {
    _id?: string;
    name?: string;
    slug?: string;
    description?: string;
    module?: string;
    label?: string;
    value?: string;
}

export interface AllPermissions {
    permissions: Permission[];
    module: string;
}

export interface Role {
    _id?: string | number;
    ids: string;
    name: string;
    slug: string;
    permissions: Permission[]
}


export interface RoleListData {
    items: Role[];
    totalRecords: number;
    limit: number;
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    prevPage?: string;
    nextPage?: number

}