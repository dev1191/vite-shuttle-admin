

export interface BusType {
    ids: string;
    name: string
    description: string
    status: boolean

}




export interface BusTypeListData {
    items: BusType[];
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

export interface BusTypeStatus {
    status: boolean
}

