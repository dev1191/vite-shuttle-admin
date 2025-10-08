

export interface Customer {
    id: string
    ids?: string
    fullname?: string;
    firstname: string
    lastname: string
    email: string
    phone: string;
    refercode?: string;
    country_code: string;
    status: boolean
}

export interface CustomerStatus {
    status: boolean;
}

export interface CustomerListData {
    items: Customer[];
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