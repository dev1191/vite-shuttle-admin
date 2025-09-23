export interface Permission {
  key: string
  value: string
}

export interface User {
  id: string
  firstname: string
  lastname: string
  email: string
  phone: string
  role: string
  permissions: Permission[]
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
