import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { LanguageService } from '@/common/api/settings/languages'
import type { Language } from '@/types/settings/languages'

const { getLanguageList, createLanguage, updateLanguage, deleteLanguage, updateLanguageStatus } = LanguageService // api languages call

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

export const useLanguages = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const languages = ref<Language[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch country list
    const fetchLanguages = async () => {
        try {
            isLoading.value = true

            const params = { ...unref(pagination) }

            // ✅ Convert range & filters to strings
            params.range = JSON.stringify(params.range)
            params.filters = JSON.stringify(params.filters)

            const response = await getLanguageList(params)

            languages.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
        } catch (error) {
            console.error('Failed to fetch languages:', error)
        } finally {
            isLoading.value = false
        }
    }

    watch(
        pagination,
        () => {
            fetchLanguages()
        },
        { deep: true },
    )

    // 🔹 Create new country
    const addLanguage = async (payload: Partial<Language>) => {
        try {
            isLoading.value = true
            const response = await createLanguage(payload)
            return response
        } catch (error) {
            console.error('Failed to create country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing country
    const editLanguage = async (id: string, payload: Partial<Language>) => {
        try {
            isLoading.value = true
            const response = await updateLanguage(id, payload)
            return response
        } catch (error) {
            console.error('Failed to update country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete country
    const removeLanguage = async (id: string) => {
        try {
            isLoading.value = true
            const result = await deleteLanguage(id)
            console.log("result", result)
            languages.value = languages.value.filter(u => u.id !== id)
            return result;
        } catch (error) {
            console.error('Failed to delete country:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const statusLanguage = async (id: string, payload: Partial<Language>) => {
        try {
            isLoading.value = true
            const response = await updateLanguageStatus(id, payload)
            return response
        } catch (error) {
            throw error
        } finally {
            isLoading.value = false
        }
    }

    fetchLanguages()

    return {
        languages,
        pagination,
        isLoading,
        fetchLanguages,
        addLanguage,
        editLanguage,
        statusLanguage,
        removeLanguage,
    }
}
