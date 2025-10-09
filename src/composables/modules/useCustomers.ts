import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { CustomerService } from '@/common/api/customer'
import type { Customer } from '@/types/customers'

const { getCustomerList, createCustomer, updateCustomer, deleteCustomer, updateCustomerStatus } = CustomerService // api customers call

// Default pagination
const makePaginationRef = () =>
    ref<PaginatingParams>({
        page: 1,
        itemsPerPage: 10,
        globalSearch: '',
        sortBy: 'createdAt',
        sortDesc: 'desc',
        range: { start: '', end: '' },
        filters: { type: 'simple', name: '', value: '' }
    })

export const useCustomers = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const customers = ref<Customer[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch customer list
    const fetchCustomers = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getCustomerList(params)

            customers.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch customers:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchCustomers()
        },
        { deep: true },
    )

    // 🔹 Create new customer
    const addCustomer = async (payload: Partial<Customer>) => {
        try {
            isLoading.value = true
            const response = await createCustomer(payload)
            return response
        } catch (error) {
            console.error('Failed to create customer:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing customer
    const editCustomer = async (id: string, payload: Partial<Customer>) => {
        try {
            isLoading.value = true
            const response = await updateCustomer(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update customer:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete customer
    const removeCustomer = async (id: string) => {
        try {
            isLoading.value = true
            await deleteCustomer(id)
            customers.value = customers.value.filter(u => u.id !== id)
        } catch (error) {
            console.error('Failed to delete customer:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusCustomer = async (id: string, payload: Partial<Customer>) => {
        try {
            isLoading.value = true
            const response = await updateCustomerStatus(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update customer status:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchCustomers()

    return {
        customers,
        pagination,
        isLoading,
        fetchCustomers,
        addCustomer,
        editCustomer,
        statusCustomer,
        removeCustomer,
    }
}
