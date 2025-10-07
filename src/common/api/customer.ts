import request from '@/common/http-client'
import type { PaginatingParams } from '@/types'
import type { CustomerListData, Customer } from '@/types/customers'
import { toFormData } from '@/utils'


export class CustomerService {
    // 🔹 Get paginated customer list
    static getCustomerList(params: PaginatingParams) {
        return request.get<CustomerListData>({
            url: '/users/search',
            params,
        })
    }


    // 🔹 Create customer
    static createCustomer(payload: Partial<Customer>) {
        return request.post<Customer>({
            url: '/users',
            data: payload,
        })
    }

    // 🔹 Update customer
    static updateCustomer(id: string, payload: Partial<Customer>) {
        const formData = toFormData(payload)
        return request.put<Customer>({
            url: `/users/${id}`,
            data: formData,
        })
    }

    // 🔹 Delete customer
    static deleteCustomer(id: string) {
        return request.del<void>({
            url: `/users/${id}`,
        })
    }
}