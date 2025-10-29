import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { BusTypeService } from '@/common/api/buses/busType'
import type { BusType } from '@/types/busTypes'

const { getBusTypeList, createBusType, updateBusType, deleteBusType, updateBusTypeStatus } = BusTypeService // api BusTypes call

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

export const useBusTypes = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const busTypes = ref<BusType[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch BusType list
    const fetchBusTypes = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getBusTypeList(params)

            busTypes.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch BusTypes:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchBusTypes()
        },
        { deep: true },
    )

    // 🔹 Create new BusType
    const addBusType = async (payload: Partial<BusType>) => {
        try {
            isLoading.value = true
            const response = await createBusType(payload)
            return response
        } catch (error) {
            console.error('Failed to create BusType:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing BusType
    const editBusType = async (id: string, payload: Partial<BusType>) => {
        try {
            isLoading.value = true
            const response = await updateBusType(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update BusType:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete BusType
    const removeBusType = async (id: string) => {
        try {
            isLoading.value = true
            const result = await deleteBusType(id)
            busTypes.value = busTypes.value.filter(u => u.id !== id)
            return result;
        } catch (error) {
            console.error('Failed to delete BusType:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusBusType = async (id: string, payload: Partial<BusType>) => {
        try {
            isLoading.value = true
            const response = await updateBusTypeStatus(id, payload)
            return response
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchBusTypes()

    return {
        busTypes,
        pagination,
        isLoading,
        fetchBusTypes,
        addBusType,
        editBusType,
        statusBusType,
        removeBusType,
    }
}
