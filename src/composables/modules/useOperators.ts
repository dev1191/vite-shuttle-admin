import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { OperatorService } from '@/common/api/operator'
import type { Operator } from '@/types'

const { getOperatorList, findOperator, createOperator, updateOperator, deleteOperator, updateOperatorStatus, checkExists } = OperatorService // api Operators call

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

export const useOperators = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const Operators = ref<Operator[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch Operator list
    const fetchOperators = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getOperatorList(params)

            Operators.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch Operators:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchOperators()
        },
        { deep: true },
    )

    const checkOperatorExists = async (email?: string, phone?: string, isEditable?: boolean) => {

        try {
            const params: { email?: string; phone?: string; isEditable?: boolean } = {}
            if (email) params.email = email
            if (phone) params.phone = phone
            if (isEditable) params.isEditable = isEditable

            const response = await checkExists(params)
            return response
        } catch (error) {
            console.error('Failed to check Operator existence:', error)
            throw error
        }

    }



    const getOperator = async (id: string) => {
        try {
            isLoading.value = true
            const response = await findOperator(id)
            return response
        } catch (error) {
            console.error('Failed to fetch Operator:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Create new Operator
    const addOperator = async (payload: Partial<Operator>) => {
        try {
            isLoading.value = true
            const response = await createOperator(payload)
            return response
        } catch (error) {
            console.error('Failed to create Operator:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing Operator
    const editOperator = async (id: string, payload: Partial<Operator>) => {
        try {
            isLoading.value = true
            const response = await updateOperator(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update Operator:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete Operator
    const removeOperator = async (id: string) => {
        try {
            isLoading.value = true
            const result = await deleteOperator(id)
            console.log("result", result)
            Operators.value = Operators.value.filter(u => u.id !== id)
            return result;
        } catch (error) {
            console.error('Failed to delete Operator:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusOperator = async (id: string, payload: Partial<Operator>) => {
        try {
            isLoading.value = true
            const response = await updateOperatorStatus(id, payload)
            return response
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchOperators()

    return {
        Operators,
        pagination,
        isLoading,
        fetchOperators,
        getOperator,
        addOperator,
        editOperator,
        statusOperator,
        removeOperator,
        checkOperatorExists
    }
}
