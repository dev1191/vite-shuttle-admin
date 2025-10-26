

export interface BusLayout {
    ids: string;
    name: string
    description: string
    status: boolean

}




export interface BusLayoutListData {
    items: BusLayout[];
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

export interface BusLayoutStatus {
    status: boolean
}

