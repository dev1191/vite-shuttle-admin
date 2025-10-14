<script setup lang="ts">
import { useOptions } from '@/composables/modules/useOptions'
import dateFormat from '@/utils/helpers/dateFormat'
import timeFormat from '@/utils/helpers/timeFormat'
import timezones from 'timezones-list'
import type { Rule } from 'ant-design-vue/es/form'

const { t } = useI18n()

interface Props {
  item: any
  isLoading: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'submit', newApp: any): void
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

const newApp = reactive({
  google_key: '',
  api_base_url: '',
  default_country: '',
  default_currency: '',
  default_language: '',
  timezone: '',
  date_format: '',
  time_format: '',
  tax_status: true,
  tax_name: '',
  tax_amount: 0,
  commission_status: true,
  commission_name: '',
  commission_amount: 0,
  background_location_update_interval: 1000,
  driver_online_location_update_interval: 1000,
  max_distance: 2000,
  prebooking_time: 30,
  distance_unit: 'kilometers',
})

watch(
  () => props.item,
  (val) => {
    if (val) {
      Object.assign(newApp, {
        ...val,
        tax_status: val.tax?.status || '',
        tax_name: val.tax?.name || '',
        tax_amount: val.tax?.amount || 0,
        commission_status: val.commission?.status || '',
        commission_name: val.commission?.name || '',
        commission_amount: val.commission?.amount || 0,
      })
    }
  },
  { immediate: true },
)

const timezoneOptions = ref<{ label: string; tzCode: string }[]>(timezones)

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
  const search = query.toLowerCase()
  timezoneOptions.value = timezones
    .filter((tz) => tz.label.toLowerCase().includes(search))
    .map((tz) => ({
      label: tz.label,
      value: tz.tzCode,
    }))
}

const onSave = () => {
  emit('submit', {
    ...newApp,
    tax: { status: newApp.tax_status, name: newApp.tax_name, amount: newApp.tax_amount },
    commission: {
      status: newApp.commission_status,
      name: newApp.commission_name,
      amount: newApp.commission_amount,
    },
  })
}

onMounted(() => {
  fetchCountries()
  fetchCurrencies()
  fetchLanguages()
})
</script>

<template>
  <a-form ref="addGeneralForm" :model="newApp" layout="vertical" @finish="onSave">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item name="default_country">
          <BaseAutoComplete
            v-model="newApp.default_country"
            :label="t('menu.settings.app.form.defaultCountry')"
            name="default_country"
            :options="
              countryOptions.map((v) => ({
                label: v.label,
                value: v.label,
                short_name: v.short_name,
              }))
            "
            :rules="[{ required: true, message: 'Country is required', trigger: 'change' }]"
            placeholder="Search or select a country"
            @search="handleCountrySearch"
          />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item name="default_currency">
          <BaseAutoComplete
            v-model="newApp.default_currency"
            :label="t('menu.settings.app.form.defaultCurrency')"
            name="default_currency"
            :options="currencyOptions.map((v) => ({ label: v.label, value: v.value }))"
            placeholder="Search or select a currency"
            @search="handleCurrencySearch"
            :rules="[{ required: true, message: 'Currency is required', trigger: 'change' }]"
          >
            <template #option="item"> {{ item.label }} ({{ item.value }}) </template>
          </BaseAutoComplete>
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item name="default_language">
          <BaseAutoComplete
            v-model="newApp.default_language"
            :label="t('menu.settings.app.form.defaultLanguage')"
            name="default_language"
            :options="languageOptions.map((v) => ({ label: v.label, value: v.value }))"
            placeholder="Search or select a language"
            @search="handleLanguageSearch"
            :rules="[{ required: true, message: 'Language is required', trigger: 'change' }]"
          >
            <template #option="item"> {{ item.label }} ({{ item.value }}) </template>
          </BaseAutoComplete>
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item name="timezone">
          <BaseAutoComplete
            v-model="newApp.timezone"
            :label="t('menu.settings.app.form.defaultTimezone')"
            name="timezone"
            :options="timezoneOptions"
            placeholder="Search or select a timezone"
            @search="handleTimezoneSearch"
            :rules="[{ required: true, message: 'Timezone is required', trigger: 'change' }]"
          >
            <template #option="item"> {{ item.label }} ({{ item.value }}) </template>
          </BaseAutoComplete>
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item
          name="date_format"
          :label="t('menu.settings.app.form.dateFormat')"
          :rules="[{ required: true, message: 'Date format is required', trigger: 'change' }]"
        >
          <a-select v-model:value="newApp.date_format" size="large" :options="dateFormat" />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item
          name="time_format"
          :label="t('menu.settings.app.form.timeFormat')"
          :rules="[{ required: true, message: 'Time format is required', trigger: 'change' }]"
        >
          <a-select v-model:value="newApp.time_format" size="large" :options="timeFormat" />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item name="tax_status" :label="t('menu.settings.app.form.setTax')">
          <a-switch v-model:checked="newApp.tax_status" />
        </a-form-item>
      </a-col>

      <a-col :span="12" v-if="newApp.tax_status">
        <a-form-item
          name="tax_name"
          :label="t('menu.settings.app.form.taxName')"
          :rules="[{ required: true, message: 'Tax name is required' }]"
        >
          <a-input v-model:value="newApp.tax_name" style="width: 100%" />
        </a-form-item>
      </a-col>

      <a-col :span="12" v-if="newApp.tax_status">
        <a-form-item
          name="tax_amount"
          :label="t('menu.settings.app.form.taxAmount')"
          :rules="[
            { required: true, message: 'Tax amount is required' },
            { type: 'number', min: 0, max: 100, message: 'Tax must be between 0 and 100' },
          ]"
        >
          <a-input-number v-model:value="newApp.tax_amount" min="0" max="100" style="width: 100%" />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item name="commission_status" :label="t('menu.settings.app.form.setCommission')">
          <a-switch v-model:checked="newApp.commission_status" />
        </a-form-item>
      </a-col>

      <a-col :span="12" v-if="newApp.commission_status">
        <a-form-item
          name="commission_name"
          :label="t('menu.settings.app.form.commissionName')"
          :rules="[{ required: true, message: 'Commission name is required' }]"
        >
          <a-input v-model:value="newApp.commission_name" style="width: 100%" />
        </a-form-item>
      </a-col>

      <a-col :span="12" v-if="newApp.commission_status">
        <a-form-item
          name="commission_amount"
          :label="t('menu.settings.app.form.commissionAmount')"
          :rules="[
            { required: true, message: 'Commission amount is required' },
            { type: 'number', min: 0, max: 100, message: 'Commission must be between 0 and 100' },
          ]"
        >
          <a-input-number
            v-model:value="newApp.commission_amount"
            min="0"
            max="100"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          name="background_location_update_interval"
          label="Background Location Update Interval (ms)"
          :rules="[{ required: true, message: 'Required field' }]"
        >
          <a-input-number
            v-model:value="newApp.background_location_update_interval"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          name="driver_online_location_update_interval"
          label="Driver Online Location Update Interval (ms)"
          :rules="[{ required: true, message: 'Required field' }]"
        >
          <a-input-number
            v-model:value="newApp.driver_online_location_update_interval"
            style="width: 100%"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Radius Range for Stops (Meters)"
          name="max_distance"
          :rules="[{ required: true, message: 'Required field' }]"
        >
          <a-input-number v-model:value="newApp.max_distance" style="width: 100%" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Last Advance Booking Time (Minutes)"
          name="prebooking_time"
          :rules="[{ required: true, message: 'Required field' }]"
        >
          <a-input-number v-model:value="newApp.prebooking_time" style="width: 100%" />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item :label="t('menu.settings.app.form.distanceUnit')" name="distance_unit">
          <a-radio-group v-model:value="newApp.distance_unit">
            <a-radio-button value="meters">{{ t('common.meters') }}</a-radio-button>
            <a-radio-button value="kilometers">{{ t('common.kilometers') }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item style="text-align: right; margin-top: 16px">
      <a-button size="large" type="primary" :loading="props.isLoading" html-type="submit"
        >Submit</a-button
      >
    </a-form-item>
  </a-form>
</template>
