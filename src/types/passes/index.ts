

export interface Pass {
    ids: string;
    name: string;
    code: string;
    symbol: string;
    status: boolean;
    rate: string;
    is_deleted: boolean;
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