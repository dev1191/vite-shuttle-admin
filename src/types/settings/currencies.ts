

export interface Currency {
    ids: string;
    name: string;
    code: string;
    symbol: string;
    status: boolean;
    rate: string;
    is_deleted: boolean;
}


export interface CurrencyListData {
    items: Currency[];
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