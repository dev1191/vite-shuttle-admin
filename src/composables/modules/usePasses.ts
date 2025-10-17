import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { PassService } from '@/common/api/passes'
import type { Pass } from '@/types/passes'

const { getPassList, createPass, updatePass, deletePass, updatePassStatus } = PassService // api passs call

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

export const usePasses = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const passs = ref<Pass[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch pass list
    const fetchPasses = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getPassList(params)

            passs.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch passs:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchPasses()
        },
        { deep: true },
    )

    // 🔹 Create new pass
    const addPass = async (payload: Partial<Pass>) => {
        try {
            isLoading.value = true
            const response = await createPass(payload)
            return response
        } catch (error) {
            console.error('Failed to create pass:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing pass
    const editPass = async (id: string, payload: Partial<Pass>) => {
        try {
            isLoading.value = true
            const response = await updatePass(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update pass:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete pass
    const removePass = async (id: string) => {
        try {
            isLoading.value = true
            await deletePass(id)
            passs.value = passs.value.filter(u => u.id !== id)
        } catch (error) {
            console.error('Failed to delete pass:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusPass = async (id: string, payload: Partial<Pass>) => {
        try {
            isLoading.value = true
            const response = await updatePassStatus(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update pass status:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchPasses()

    return {
        passs,
        pagination,
        isLoading,
        fetchPasses,
        addPass,
        editPass,
        statusPass,
        removePass,
    }
}
