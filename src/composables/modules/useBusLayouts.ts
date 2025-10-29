import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { BusLayoutService } from '@/common/api/buses/busLayout'
import type { BusLayout } from '@/types/busLayouts'

const { getBusLayoutList, createBusLayout, updateBusLayout, deleteBusLayout, updateBusLayoutStatus } = BusLayoutService // api BusLayouts call

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

export const useBusLayouts = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const busLayouts = ref<BusLayout[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch BusLayout list
    const fetchBusLayouts = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getBusLayoutList(params)

            busLayouts.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch BusLayouts:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchBusLayouts()
        },
        { deep: true },
    )

    // 🔹 Create new BusLayout
    const addBusLayout = async (payload: Partial<BusLayout>) => {
        try {
            isLoading.value = true
            const response = await createBusLayout(payload)
            return response
        } catch (error) {
            console.error('Failed to create BusLayout:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing BusLayout
    const editBusLayout = async (id: string, payload: Partial<BusLayout>) => {
        try {
            isLoading.value = true
            const response = await updateBusLayout(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update BusLayout:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete BusLayout
    const removeBusLayout = async (id: string) => {
        try {
            isLoading.value = true
            const result = await deleteBusLayout(id)
            busLayouts.value = busLayouts.value.filter(u => u.id !== id)
            return result;
        } catch (error) {
            console.error('Failed to delete BusLayout:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusBusLayout = async (id: string, payload: Partial<BusLayout>) => {
        try {
            isLoading.value = true
            const response = await updateBusLayoutStatus(id, payload)
            return response
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchBusLayouts()

    return {
        busLayouts,
        pagination,
        isLoading,
        fetchBusLayouts,
        addBusLayout,
        editBusLayout,
        statusBusLayout,
        removeBusLayout,
    }
}
