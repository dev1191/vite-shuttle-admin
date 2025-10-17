import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { HelpAndSupportService } from '@/common/api/helpAndSupport'
import type { HelpAndSupport } from '@/types/helpAndSupports'

const { getHelpAndSupportList, updateHelpAndSupport, deleteHelpAndSupport, updateHelpAndSupportStatus } = HelpAndSupportService // api offers call

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

export const useHelpAndSupport = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const helpers = ref<HelpAndSupport[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch pass list
    const fetchHelpAndSupports = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getHelpAndSupportList(params)

            helpers.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch offers:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchHelpAndSupports()
        },
        { deep: true },
    )



    // 🔹 Update existing pass
    const editHelpAndSupport = async (id: string, payload: Partial<HelpAndSupport>) => {
        try {
            isLoading.value = true
            const response = await updateHelpAndSupport(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update pass:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete pass
    const removeHelpAndSupport = async (id: string) => {
        try {
            isLoading.value = true
            await deleteHelpAndSupport(id)
            helpers.value = helpers.value.filter(u => u.id !== id)
        } catch (error) {
            console.error('Failed to delete pass:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusHelpAndSupport = async (id: string, payload: Partial<HelpAndSupport>) => {
        try {
            isLoading.value = true
            const response = await updateHelpAndSupportStatus(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update pass status:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchHelpAndSupports()

    return {
        helpers,
        pagination,
        isLoading,
        fetchHelpAndSupports,
        editHelpAndSupport,
        statusHelpAndSupport,
        removeHelpAndSupport,
    }
}
