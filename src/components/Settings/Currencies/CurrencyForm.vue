<script setup lang="ts">
import type { Currency } from '@/types'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useCurrencies } from '@/composables/modules/useCurrencies'

interface Props {
  isEdit: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'submit', formData: Currency): void
}
const emit = defineEmits<Emits>()
const { t } = useI18n()
const drawerRef = ref()
const drawerVisible = ref(false)
const isEdit = ref(props.isEdit)
const loading = ref(false)

const { addCurrency, editCurrency, fetchCurrencies } = useCurrencies()

const formData = reactive({
  name: '',
  code: '',
  symbol: '',
  status: true,
})

watch(formData, (newValue) => {
  formData.code = newValue.code.toUpperCase()
})

const rules: Record<string, Rule[]> = {
  name: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.settings.currencies.form.name'),
      }),
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.settings.currencies.form.code'),
      }),
      trigger: 'blur',
    },
  ],
  symbol: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.settings.currencies.form.symbol') }),
      trigger: 'blur',
    },
  ],
}

function openDrawer(edit = false, record?: Currency) {
  isEdit.value = edit
  drawerVisible.value = true
  if (edit && record) Object.assign(formData, record)
}

function handleClose() {
  drawerVisible.value = false
  Object.assign(formData, {
    ids: '',
    name: '',
    code: '',
    symbol: '',
    status: true,
  })
}

async function handleSubmit(formData: Currency) {
  try {
    loading.value = true
    emit('submit', formData)
    handleClose()
  } finally {
    loading.value = false
  }
}

defineExpose({
  openDrawer,
  drawerVisible,
  isEdit,
})
</script>

<template>
  <BaseDrawerForm
    ref="drawerRef"
    :visible="drawerVisible"
    :title="isEdit ? 'Edit Currency' : 'Create Currency'"
    :formData="formData"
    :loading="loading"
    :isEdit="isEdit"
    :rules="rules"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #fields="{ form }">
      <a-form-item :label="t('menu.settings.currencies.form.name')" name="name">
        <a-input
          size="large"
          v-model:value="form.name"
          :placeholder="
            t('validation.placeholder', { name: t('menu.settings.currencies.form.name') })
          "
        />
      </a-form-item>
      <a-form-item :label="t('menu.settings.currencies.form.code')" name="code">
        <a-input
          size="large"
          v-model:value="form.code"
          :placeholder="
            t('validation.placeholder', { name: t('menu.settings.currencies.form.code') })
          "
        />
      </a-form-item>

      <a-form-item :label="t('menu.settings.currencies.form.symbol')" name="symbol">
        <a-input
          size="large"
          v-model:value="form.symbol"
          :placeholder="
            t('validation.placeholder', { name: t('menu.settings.currencies.form.symbol') })
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
