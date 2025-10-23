

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
    business_name?: string
    commission?: number
    commission_type?: 'percentage' | 'fixed'
    gst_certificate?: File | null;
    registration_certificate_url?: string;
    tax_document_url?: string;
    transport_permit_url?: string;
    gst_certificate_url?: string;
    tax_document?: File | null;
    transport_permit?: File | null;
    registration_certificate?: File | null;
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

