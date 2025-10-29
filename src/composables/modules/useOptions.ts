import { ref, onMounted } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { Countrieservice } from '@/common/api/settings/countries'
import { CountrieService } from '@/common/api/settings/currencies'
import { LanguageService } from '@/common/api/settings/languages'
import { BusTypeService } from '@/common/api/buses/busType'
import type { OptionLists } from '@/types'

const { fetchCountryOptions } = Countrieservice
const { fetchCurrencyOptions } = CountrieService
const { fetchLanguageOptions } = LanguageService
const { fetchBusTypeOptions } = BusTypeService

export const useOptions = () => {
    const countryOptions = ref<OptionLists[]>([])
    const currencyOptions = ref<OptionLists[]>([])
    const languageOptions = ref<OptionLists[]>([])
    const busTypeOptions = ref<OptionLists[]>([])
    const searchCountry = ref('')
    const searchCurrency = ref("")
    const searchLanguage = ref("")
    const searchBusType = ref("")

    const fetchCountries = async () => {
        try {
            const result = await fetchCountryOptions({ search: searchCountry.value || '' })
            countryOptions.value = Array.isArray(result) ? result : [result]
        } catch (error) {
            console.error('❌ Failed to fetch countries:', error)
            countryOptions.value = []
        }
    }


    const fetchCurrencies = async () => {
        try {
            const result = await fetchCurrencyOptions({ search: searchCurrency.value || '' })
            currencyOptions.value = Array.isArray(result) ? result : [result]
        } catch (error) {
            console.error('❌ Failed to fetch currencies:', error)
            currencyOptions.value = []
        }
    }

    const fetchLanguages = async () => {
        try {
            const result = await fetchLanguageOptions({ search: searchLanguage.value || '' })
            languageOptions.value = Array.isArray(result) ? result : [result]
        } catch (error) {
            console.error('❌ Failed to fetch languages:', error)
            languageOptions.value = []
        }
    }

    const fetchBusTypes = async () => {
        try {
            const result = await fetchBusTypeOptions({ search: searchLanguage.value || '' })
            busTypeOptions.value = Array.isArray(result) ? result : [result]
        } catch (error) {
            console.error('❌ Failed to fetch languages:', error)
            busTypeOptions.value = []
        }
    }


    // 👇 Fetch with debounce when typing
    watchDebounced(searchCountry, fetchCountries, { debounce: 400, maxWait: 1000 })
    watchDebounced(searchCurrency, fetchCurrencies, { debounce: 400, maxWait: 1000 })
    watchDebounced(searchLanguage, fetchLanguages, { debounce: 400, maxWait: 1000 })
    watchDebounced(searchBusType, fetchBusTypes, { debounce: 400, maxWait: 1000 })


    return {
        countryOptions,
        currencyOptions,
        languageOptions,
        busTypeOptions,
        searchCountry,
        searchCurrency,
        searchLanguage,
        searchBusType,
        fetchCountries,
        fetchCurrencies,
        fetchLanguages,
        fetchBusTypes
    }
}
