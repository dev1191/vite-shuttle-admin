<script setup lang="ts">
import type { Country } from '@/types'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useCountries } from '@/composables/modules/useCountries'
import { generateReferralCode } from '@/utils'

const { t } = useI18n()
const drawerRef = ref()
const drawerVisible = ref(false)
const isEdit = ref(false)
const loading = ref(false)

const { addCountry, editCountry, fetchCountries } = useCountries()

const formData = reactive({
  name: '',
  short_name: '',
  phone_code: '',
  status: true,
})

watch(formData, (newValue) => {
  formData.short_name = newValue.short_name.toUpperCase()
})

const rules: Record<string, Rule[]> = {
  name: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.settings.countries.form.name'),
      }),
      trigger: 'blur',
    },
  ],
  phone_code: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.settings.countries.form.phone_code'),
      }),
      trigger: 'blur',
    },
  ],
  short_name: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.settings.countries.form.short_name') }),
      trigger: 'blur',
    },
  ],
}

function openDrawer(edit = false, record?: Country) {
  isEdit.value = edit
  drawerVisible.value = true
  if (edit && record) Object.assign(formData, record)
}

function handleClose() {
  drawerVisible.value = false
  Object.assign(formData, {
    ids: '',
    name: '',
    short_name: '',
    phone_code: '',
    status: true,
  })
}

async function handleSubmit(formData: Country) {
  try {
    loading.value = true

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (isEdit.value) {
      // Edit existing country
      await editCountry(formData.ids, {
        name: formData.name,
        short_name: formData.short_name,
        phone_code: formData.phone_code,
        country_code: formData.country_code,
        status: formData.status,
      })
    } else {
      // Add new country
      await addCountry(formData)
    }

    message.success(
      isEdit.value
        ? t('common.updateMessage', { name: formData.name })
        : t('common.createMessage', { name: formData.name }),
    )
    fetchCountries()
    handleClose()
  } finally {
    loading.value = false
  }
}

defineExpose({
  openDrawer,
})
</script>

<template>
  <BaseDrawerForm
    ref="drawerRef"
    :visible="drawerVisible"
    :title="isEdit ? 'Edit Country' : 'Create Country'"
    :formData="formData"
    :loading="loading"
    :isEdit="isEdit"
    :rules="rules"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #fields="{ form }">
      <a-form-item :label="t('menu.settings.countries.form.name')" name="name">
        <a-input
          size="large"
          v-model:value="form.name"
          :placeholder="
            t('validation.placeholder', { name: t('menu.settings.countries.form.name') })
          "
        />
      </a-form-item>
      <a-form-item :label="t('menu.settings.countries.form.short_name')" name="short_name">
        <a-input
          size="large"
          v-model:value="form.short_name"
          :placeholder="
            t('validation.placeholder', { name: t('menu.settings.countries.form.short_name') })
          "
        />
      </a-form-item>

      <a-form-item :label="t('menu.settings.countries.form.phone_code')" name="phone_code">
        <a-input
          size="large"
          v-model:value="form.phone_code"
          :placeholder="
            t('validation.placeholder', { name: t('menu.settings.countries.form.phone_code') })
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
