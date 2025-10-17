

export interface Pass {
    ids?: string;
    no_of_rides: number;
    no_of_valid_days: number;
    price_per_km: string;
    description: string;
    terms: string;
    status: boolean;
    discount: number;
}


export interface PassStatus {
    status: boolean
}

export interface PassListData {
    items: Pass[];
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