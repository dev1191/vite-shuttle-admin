import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { OfferService } from '@/common/api/offer'
import type { Offer } from '@/types/offers'

const { getOfferList, createOffer, updateOffer, deleteOffer, updateOfferStatus } = OfferService // api offers call

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

export const useOfferes = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const offers = ref<Offer[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch pass list
    const fetchOffers = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getOfferList(params)

            offers.value = response.items ?? []
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
            fetchOffers()
        },
        { deep: true },
    )

    // 🔹 Create new pass
    const addOffer = async (payload: Partial<Offer>) => {
        try {
            isLoading.value = true
            const response = await createOffer(payload)
            return response
        } catch (error) {
            console.error('Failed to create pass:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing pass
    const editOffer = async (id: string, payload: Partial<Offer>) => {
        try {
            isLoading.value = true
            const response = await updateOffer(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update pass:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete pass
    const removeOffer = async (id: string) => {
        try {
            isLoading.value = true
            await deleteOffer(id)
            offers.value = offers.value.filter(u => u.id !== id)
        } catch (error) {
            console.error('Failed to delete pass:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusOffer = async (id: string, payload: Partial<Offer>) => {
        try {
            isLoading.value = true
            const response = await updateOfferStatus(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update pass status:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchOffers()

    return {
        offers,
        pagination,
        isLoading,
        fetchOffers,
        addOffer,
        editOffer,
        statusOffer,
        removeOffer,
    }
}
