

export interface Permission {
    id: string;
    name: string;
    slug: string;
}

export interface Role {
    id: string | number;
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