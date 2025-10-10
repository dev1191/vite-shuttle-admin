import { ref, onMounted } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { Countrieservice } from '@/common/api/settings/countries'
import type { OptionLists } from '@/types'

const { fetchCountryOptions } = Countrieservice

export const useOptions = () => {
    const countryOptions = ref<OptionLists[]>([])
    const searchCountry = ref('')

    const fetchCountries = async () => {
        try {
            const result = await fetchCountryOptions({ search: searchCountry.value || '' })
            countryOptions.value = Array.isArray(result) ? result : [result]
        } catch (error) {
            console.error('❌ Failed to fetch countries:', error)
            countryOptions.value = []
        }
    }


    // 👇 Fetch with debounce when typing
    watchDebounced(
        searchCountry,
        () => fetchCountries(),
        { debounce: 400, maxWait: 1000 }
    )

    return {
        countryOptions,
        searchCountry,
        fetchCountries,
    }
}
