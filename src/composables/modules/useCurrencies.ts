import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { CountrieService } from '@/common/api/settings/currencies'
import type { Currency } from '@/types/settings/currencies'

const { getCurrencyList, createCurrency, updateCurrency, deleteCurrency, updateCurrencieStatus } = CountrieService // api currencies call

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

export const useCurrencies = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const currencies = ref<Currency[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch country list
    const fetchCurrencies = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getCurrencyList(params)

            currencies.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch currencies:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchCurrencies()
        },
        { deep: true },
    )

    // 🔹 Create new country
    const addCurrency = async (payload: Partial<Currency>) => {
        try {
            isLoading.value = true
            const response = await createCurrency(payload)
            return response
        } catch (error) {
            console.error('Failed to create country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing country
    const editCurrency = async (id: string, payload: Partial<Currency>) => {
        try {
            isLoading.value = true
            const response = await updateCurrency(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete country
    const removeCurrency = async (id: string) => {
        try {
            isLoading.value = true
            const result = await deleteCurrency(id)
            console.log("result", result)
            currencies.value = currencies.value.filter(u => u.id !== id)
            return result;
        } catch (error) {
            console.error('Failed to delete country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusCurrency = async (id: string, payload: Partial<Currency>) => {
        try {
            isLoading.value = true
            const response = await updateCurrencieStatus(id, payload)
            return response
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchCurrencies()

    return {
        currencies,
        pagination,
        isLoading,
        fetchCurrencies,
        addCurrency,
        editCurrency,
        statusCurrency,
        removeCurrency,
    }
}
