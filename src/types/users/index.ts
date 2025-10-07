

export interface User {
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
  permissions?: Permission[]
  picture?: string
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  contact_no?: string | null
  pincode?: string | null
  company?: string
  commission?: number
  document_gst_certificate?: string
  document_pan_card?: string
  is_active?: string | boolean
}


export interface UserListData {
  items: User[];
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