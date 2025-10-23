<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import metadata from 'libphonenumber-js/metadata.full.json'
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

interface Props {
  modelValue: string
  label?: string
  name: string
  placeHolderPhone: string
  rules?: Record<string, any>[]
  defaultCountry?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Phone Number',
  defaultCountry: 'IN',
  rules: () => [],
})

const emit = defineEmits(['update:modelValue', 'update:countryCode'])

const selectedCountry = ref(props.defaultCountry)
const phoneNumber = ref(props.modelValue)

const countries = computed(() =>
  getCountries().map((c) => ({
    code: c,
    dialCode: getCountryCallingCode(c, metadata),
    label: new Intl.DisplayNames(['en'], { type: 'region' }).of(c),
  })),
)

const countryCode = computed(() => {
  return countries.value.find((c) => c.code === selectedCountry.value)?.dialCode || ''
})

// sync to parent
watch(phoneNumber, (val) => emit('update:modelValue', val))
watch(selectedCountry, () => emit('update:countryCode', countryCode.value))

// sync from parent
watch(
  () => props.modelValue,
  (val) => {
    if (val !== phoneNumber.value) phoneNumber.value = val
  },
)

watch(
  () => props.defaultCountry,
  (val) => {
    if (val && val !== selectedCountry.value) selectedCountry.value = val
  },
)

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
      <a-form-item-rest>
        <a-select
          size="large"
          v-model:value="selectedCountry"
          style="width: 160px"
          show-search
          :filter-option="filterOption"
          placeholder="Select country"
        >
          <template v-for="c in countries" :key="c.code">
            <a-select-option :value="c.code"> {{ c.label }} (+{{ c.dialCode }}) </a-select-option>
          </template>
        </a-select>
      </a-form-item-rest>

      <a-input
        size="large"
        v-model:value="phoneNumber"
        style="width: calc(100% - 160px)"
        :placeholder="placeHolderPhone"
      />
    </a-input-group>
  </a-form-item>
</template>
