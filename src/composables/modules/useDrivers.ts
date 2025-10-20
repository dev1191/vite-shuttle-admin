import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { DriverService } from '@/common/api/driver'
import type { Driver } from '@/types'

const { getDriverList, createDriver, updateDriver, deleteDriver, updateDriverStatus } = DriverService // api Drivers call

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

export const useDrivers = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const Drivers = ref<Driver[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch Driver list
    const fetchDrivers = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getDriverList(params)

            Drivers.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch Drivers:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchDrivers()
        },
        { deep: true },
    )

    // 🔹 Create new Driver
    const addDriver = async (payload: Partial<Driver>) => {
        try {
            isLoading.value = true
            const response = await createDriver(payload)
            return response
        } catch (error) {
            console.error('Failed to create Driver:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing Driver
    const editDriver = async (id: string, payload: Partial<Driver>) => {
        try {
            isLoading.value = true
            const response = await updateDriver(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update Driver:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete Driver
    const removeDriver = async (id: string) => {
        try {
            isLoading.value = true
            const result = await deleteDriver(id)
            console.log("result", result)
            Drivers.value = Drivers.value.filter(u => u.id !== id)
            return result;
        } catch (error) {
            console.error('Failed to delete Driver:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusDriver = async (id: string, payload: Partial<Driver>) => {
        try {
            isLoading.value = true
            const response = await updateDriverStatus(id, payload)
            return response
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchDrivers()

    return {
        Drivers,
        pagination,
        isLoading,
        fetchDrivers,
        addDriver,
        editDriver,
        statusDriver,
        removeDriver,
    }
}
