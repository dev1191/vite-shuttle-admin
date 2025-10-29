

export interface Driver {
    ids: string;
    adminId: string
    firstname: string
    lastname: string
    short_name: string
    email: string
    country_code: string
    phone: string
    national_id: string
    picture: string
    document_licence: string
    document_national_icard: string
    document_police_vertification: string
    status: boolean
    type: string
}




export interface DriverListData {
    items: Driver[];
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

export interface DriverStatus {
    status: boolean
}

