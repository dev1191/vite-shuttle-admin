<script setup lang="ts">
import type { Language } from '@/types/settings/languages'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useLanguages } from '@/composables/modules/useLanguages'
import { useOptions } from '@/composables/modules/useOptions'

interface Props {
  isEdit: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'submit', formData: Language): void
}
const emit = defineEmits<Emits>()
const { t } = useI18n()
const drawerRef = ref()
const drawerVisible = ref(false)
const isEdit = ref(props.isEdit)
const loading = ref(false)

const { addLanguage, editLanguage, fetchLanguages } = useLanguages()
const { fetchCountries, countryOptions, searchCountry } = useOptions()
const formData = reactive<Language>({
  label: '',
  code: '',
  country_name: '',
  countryId: '',
  status: true,
})

watch(
  () => formData.country_name,
  (newValue) => {
    formData.countryId = countryOptions.value.find((v) => v.label === newValue)?.id
  },
)
const rules: Record<string, Rule[]> = {
  label: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.settings.languages.form.label'),
      }),
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.settings.languages.form.code'),
      }),
      trigger: 'blur',
    },
  ],
  symbol: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.settings.languages.form.symbol') }),
      trigger: 'blur',
    },
  ],
}

function openDrawer(edit = false, record?: Language) {
  isEdit.value = edit
  drawerVisible.value = true
  if (edit && record) Object.assign(formData, record)
}

function handleClose() {
  drawerVisible.value = false
  Object.assign(formData, {
    ids: '',
    label: '',
    code: '',
    country_name: '',
    countryId: '',
    status: true,
  })
}

async function handleSubmit(formData: Language) {
  try {
    loading.value = true
    emit('submit', formData)
    handleClose()
  } finally {
    loading.value = false
  }
}

const handleSearch = (query: string) => {
  searchCountry.value = query
}

defineExpose({
  openDrawer,
  drawerVisible,
  isEdit,
})

onMounted(async () => await fetchCountries())
</script>

<template>
  <BaseDrawerForm
    ref="drawerRef"
    :visible="drawerVisible"
    :title="isEdit ? 'Edit Language' : 'Create Language'"
    :formData="formData"
    :loading="loading"
    :isEdit="isEdit"
    :rules="rules"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #fields="{ form }">
      <BaseAutoComplete
        v-model="form.country_name"
        :label="t('menu.settings.languages.form.country')"
        name="country"
        :options="countryOptions.map((v) => ({ label: v.label, value: v.label }))"
        placeholder="Search or select a country"
        @search="handleSearch"
      />

      <a-form-item :label="t('menu.settings.languages.form.label')" name="label">
        <a-input
          size="large"
          v-model:value="form.label"
          :placeholder="
            t('validation.placeholder', { name: t('menu.settings.languages.form.label') })
          "
        />
      </a-form-item>
      <a-form-item :label="t('menu.settings.languages.form.code')" name="code">
        <a-input
          size="large"
          v-model:value="form.code"
          :placeholder="
            t('validation.placeholder', { name: t('menu.settings.languages.form.code') })
          "
        />
      </a-form-item>

      <a-form-item :label="t('common.status')" name="status">
        <a-radio-group v-model:value="formData.status">
          <a-radio-button :value="true">{{ t('common.active') }}</a-radio-button>
          <a-radio-button :value="false">{{ t('common.inactive') }}</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </template>
  </BaseDrawerForm>
</template>

<style scoped></style>
