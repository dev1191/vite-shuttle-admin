<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import metadata from 'libphonenumber-js/metadata.full.json'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

interface Props {
  /** v-model value -> only phone digits */
  modelValue: string

  /** label for the form item */
  label?: string

  /** field name (used in a-form validation) */
  name: string

  /** placeholder for phone input */
  placeHolderPhone: string

  /** validation rules */
  rules?: Record<string, any>[]

  /** default country (ISO code, e.g., IN, US) */
  defaultCountry?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Phone Number',
  defaultCountry: 'IN',
  rules: () => [],
})

const emit = defineEmits([
  'update:modelValue', // phone number only
  'update:countryCode', // separate dial code
])

// reactive states
const selectedCountry = ref(props.defaultCountry)
const phoneNumber = ref(props.modelValue)

// all country options
const countries = computed(() =>
  getCountries().map((c) => ({
    code: c,
    dialCode: getCountryCallingCode(c, metadata),
    label: new Intl.DisplayNames(['en'], { type: 'region' }).of(c),
  })),
)

// selected dial code
const countryCode = computed(() => {
  return countries.value.find((c) => c.code === selectedCountry.value)?.dialCode || ''
})

// 🔄 keep parent v-models synced
watch(phoneNumber, (val) => {
  emit('update:modelValue', val) // only phone digits
})
watch(selectedCountry, () => {
  emit('update:countryCode', countryCode.value) // dial code separately
})

// search filter for select
const filterOption = (input: string, option: any) => {
  const country = countries.value.find((c) => c.code === option.value)
  if (!country) return false
  const search = input.toLowerCase()
  return (
    country.label.toLowerCase().includes(search) ||
    country.code.toLowerCase().includes(search) ||
    country.dialCode.includes(search)
  )
}
</script>

<template>
  <a-form-item :label="label" :name="name" :rules="rules">
    <a-input-group compact>
      <!-- Country Select -->
      <a-form-item-rest>
        <a-select
          size="large"
          v-model:value="selectedCountry"
          style="width: 150px"
          show-search
          :filter-option="filterOption"
          placeholder="Select country"
        >
          <template v-for="c in countries" :key="c.code">
            <a-select-option :value="c.code"> {{ c.label }} (+{{ c.dialCode }}) </a-select-option>
          </template>
        </a-select>
      </a-form-item-rest>

      <!-- Phone input -->
      <a-input
        size="large"
        v-model:value="phoneNumber"
        style="width: calc(100% - 150px)"
        :placeholder="placeHolderPhone"
      />
    </a-input-group>
  </a-form-item>
</template>
