

export interface Operator {
    id: string
    ids?: string
    fullname?: string;
    firstname: string
    lastname: string
    email: string
    phone: string
    role: string
    country_code: string;
    password?: string;
    confirmPassword?: string;
    picture?: string
    business_email?: string;
    business_contactno?: string;
    address_1?: string | null
    address_2?: string | null
    city?: string | null
    contact_no?: string | null
    pincode?: string | null
    company?: string
    commission?: number
    commission_type?: 'percentage' | 'fixed'
    gst_certificate?: string | [];
    tax_document?: string | [];
    transport_permit?: string | [];
    registration_certificate?: string | [];
    is_active?: string | boolean
}




export interface OperatorListData {
    items: Operator[];
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

export interface OperatorStatus {
    status: boolean
}

