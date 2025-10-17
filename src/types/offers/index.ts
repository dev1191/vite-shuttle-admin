

export interface Offer {
    ids?: string;
    adminId?: string,
    name: string,
    code: string,
    discount: string,
    attempt: string,
    dateRange?: [string];
    start_date?: string,
    end_date?: string,
    type: string,
    routeId: string;
    route_name?: string,
    terms: string,
    picture: string,
    status: boolean;

}


export interface OfferStatus {
    status: boolean
}

export interface OfferListData {
    items: Offer[];
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