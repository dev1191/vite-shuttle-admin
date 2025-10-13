<script setup lang="ts">
import { useOptions } from '@/composables/modules/useOptions'

import timezones from 'timezones-list'

const { t } = useI18n()

interface Props {
  item: any
  isLoading: boolean
}
const props = defineProps<Props>()
interface Emits {
  (e: 'submit', newGeneral: any): void
}
const emit = defineEmits<Emits>()

const {
  fetchCountries,
  fetchCurrencies,
  fetchLanguages,
  countryOptions,
  searchCountry,
  searchLanguage,
  currencyOptions,
  searchCurrency,
  languageOptions,
} = useOptions()

const newGeneral = reactive({
  google_key: '',
  api_base_url: '',
  default_country: '',
  default_currency: '',
  default_language: '',
  timezone: '',
  date_format: '',
  time_format: '',
  tax: {
    name: '',
    amount: 0,
  },
  commission: {
    name: '',
    amount: 0,
  },
  background_location_update_interval: 1000,
  driver_online_location_update_interval: 1000,
  max_distance: 2000,
  prebooking_time: 30,
})

watch(
  () => props.item,
  (val) => {
    if (val) Object.assign(newGeneral, val)
  },
  { immediate: true },
)

const isLoading = ref(false)
const languageSearchValue = ref<string>('')
const timezoneOptions = ref<[]>(timezones)
const handleCountrySearch = (query: string) => {
  searchCountry.value = query
}

const handleCurrencySearch = (query: string) => {
  searchCurrency.value = query
}

const handleLanguageSearch = (query: string) => {
  searchLanguage.value = query
}

const handleTimezoneSearch = (query: string) => {
  // languageSearchValue.value = query

  const search = query.toLowerCase()
  timezoneOptions.value = timezones
    .filter((tz) => tz.label.toLowerCase().includes(search))
    .map((tz) => ({
      label: tz.label,
      value: tz.tzCode,
    }))
}

const onSave = () => {
  console.log('Form submitted', newGeneral)
}

// Optional: load once on mount
onMounted(() => {
  fetchCountries()
  fetchCurrencies()
  fetchLanguages()
})
</script>

<template>
  <a-form ref="addGeneralForm" :model="newGeneral" layout="vertical" @finish="onSave">
    <!-- Tax and Fee -->
    <a-row :gutter="24">
      <a-col :span="12">
        <BaseAutoComplete
          v-model="newGeneral.default_country"
          :label="t('menu.settings.app.form.defaultCountry')"
          name="country"
          :options="
            countryOptions.map((v) => ({
              label: v.label,
              value: v.label,
              short_name: v.short_name,
            }))
          "
          placeholder="Search or select a country"
          @search="handleCountrySearch"
        />
      </a-col>
      <a-col :span="12">
        <BaseAutoComplete
          v-model="newGeneral.default_currency"
          :label="t('menu.settings.app.form.defaultCurrency')"
          name="currency"
          :options="currencyOptions.map((v) => ({ label: v.label, value: v.value }))"
          placeholder="Search or select a currency"
          @search="handleCurrencySearch"
        >
          <template #option="item"> {{ item.label }} ({{ item.value }}) </template>
        </BaseAutoComplete>
      </a-col>

      <a-col :span="12">
        <BaseAutoComplete
          v-model="newGeneral.default_language"
          :label="t('menu.settings.app.form.defaultLanguage')"
          name="language"
          :options="languageOptions.map((v) => ({ label: v.label, value: v.value }))"
          placeholder="Search or select a language"
          @search="handleLanguageSearch"
        >
          <template #option="item"> {{ item.label }} ({{ item.value }}) </template>
        </BaseAutoComplete>
      </a-col>

      <a-col :span="12">
        <BaseAutoComplete
          v-model="newGeneral.timezone"
          :label="t('menu.settings.app.form.defaultTimezone')"
          name="timezone"
          :options="timezoneOptions"
          placeholder="Search or select a timezones"
          @search="handleTimezoneSearch"
        >
          <template #option="item"> {{ item.label }} ({{ item.value }}) </template>
        </BaseAutoComplete>
      </a-col>

      <a-col :span="12">
        <a-form-item label="Tax Name" name="tax">
          <a-input-number v-model:value="newGeneral.tax.name" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Tax (%)"
          name="tax"
          :rules="[{ required: true, message: 'Tax is required' }]"
        >
          <a-input-number
            v-model:value="newGeneral.tax.amount"
            min="0"
            max="100"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Fee (%)"
          name="fee"
          :rules="[{ required: true, message: 'Fee is required' }]"
        >
          <a-input-number
            v-model:value="newGeneral.commission.amount"
            min="0"
            max="100"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Background & Driver intervals -->
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Background Location Update Interval (ms)"
          name="background_location_update_interval"
          :rules="[{ required: true, message: 'This field is required' }]"
        >
          <a-input-number
            v-model:value="newGeneral.background_location_update_interval"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Driver Online Location Update Interval (ms)"
          name="driver_online_location_update_interval"
          :rules="[{ required: true, message: 'This field is required' }]"
        >
          <a-input-number
            v-model:value="newGeneral.driver_online_location_update_interval"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Max Distance & Prebooking Time -->
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="Radius Range for Stops (Meters)" name="max_distance">
          <a-input-number v-model:value="newGeneral.max_distance" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Last Advance Booking Time (Minutes)" name="prebooking_time">
          <a-input-number v-model:value="newGeneral.prebooking_time" style="width: 100%" />
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Submit -->
    <a-form-item style="text-align: right; margin-top: 16px">
      <a-button type="primary" :loading="isLoading" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
