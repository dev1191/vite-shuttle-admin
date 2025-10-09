import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { Countrieservice } from '@/common/api/settings/countries'
import type { Country } from '@/types'

const { getCountryList, createCountry, updateCountry, deleteCountry, updateCountriestatus } = Countrieservice // api countries call

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

export const useCountries = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const countries = ref<Country[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch country list
    const fetchCountries = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getCountryList(params)

            countries.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch countries:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchCountries()
        },
        { deep: true },
    )

    // 🔹 Create new country
    const addCountry = async (payload: Partial<Country>) => {
        try {
            isLoading.value = true
            const response = await createCountry(payload)
            return response
        } catch (error) {
            console.error('Failed to create country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing country
    const editCountry = async (id: string, payload: Partial<Country>) => {
        try {
            isLoading.value = true
            const response = await updateCountry(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete country
    const removeCountry = async (id: string) => {
        try {
            isLoading.value = true
            const result = await deleteCountry(id)
            console.log("result", result)
            countries.value = countries.value.filter(u => u.id !== id)
            return result;
        } catch (error) {
            console.error('Failed to delete country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusCountry = async (id: string, payload: Partial<Country>) => {
        try {
            isLoading.value = true
            const response = await updateCountriestatus(id, payload)
            return response
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchCountries()

    return {
        countries,
        pagination,
        isLoading,
        fetchCountries,
        addCountry,
        editCountry,
        statusCountry,
        removeCountry,
    }
}
