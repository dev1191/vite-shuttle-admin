<script setup lang="ts">
import type { Offer } from '@/types/offers'
import type { Rule } from 'ant-design-vue/es/form'
import { PercentageOutlined } from '@ant-design/icons-vue'
import { serializeDateRange } from '@/utils'

interface Props {
  isEdit: boolean
  isLoading: boolean
  dateFormat: string
}
const props = defineProps<Props>()

const { t } = useI18n()
const drawerRef = ref()
const drawerVisible = ref(false)
const isEdit = ref(props.isEdit)
const loading = ref(false)

interface Emits {
  (e: 'submit', formData: Offer): void
}
const emit = defineEmits<Emits>()

const formatDate = ref(props.dateFormat)
const formData = reactive<Offer>({
  name: '',
  code: '',
  discount: '',
  attempt: '',
  dateRange: [],
  type: '',
  routeId: '',
  picture: '',
  terms: '',
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
        name: t('menu.offers.form.name'),
      }),
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.offers.form.code'),
      }),
      trigger: 'blur',
    },
  ],
  attempt: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.offers.form.attempt') }),
      trigger: 'blur',
    },
  ],
  discount: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.offers.form.discount') }),
      trigger: 'blur',
    },
  ],
}

function openDrawer(edit = false, record?: Offer) {
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
    discount: '',
    attempt: '',
    dateRange: '',
    type: '',
    routeId: '',
    picture: '',
    terms: '',
    status: true,
  })
}

async function handleSubmit(formData: Offer) {
  try {
    loading.value = true
    emit('submit', { ...formData, ...serializeDateRange(formData.dateRange) })
  } finally {
    loading.value = false
  }
}

defineExpose({
  openDrawer,
  handleClose,
  loading,
})
</script>

<template>
  <BaseDrawerForm
    ref="drawerRef"
    :visible="drawerVisible"
    :title="isEdit ? 'Edit Offer' : 'Create Offer'"
    :formData="formData"
    :loading="props.isLoading"
    :width="800"
    :isEdit="isEdit"
    :rules="rules"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #fields="{ form }">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :label="t('menu.offers.form.name')" name="name">
            <a-input
              size="large"
              class="w-full"
              v-model:value="form.name"
              :min="0"
              :placeholder="t('validation.placeholder', { name: t('menu.offers.form.name') })"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="t('menu.offers.form.code')" name="code">
            <a-input
              size="large"
              class="w-full"
              :min="0"
              v-model:value="form.code"
              :placeholder="t('validation.placeholder', { name: t('menu.offers.form.code') })"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="t('menu.offers.form.attempt')" name="attempt">
            <a-input-number
              size="large"
              class="w-full"
              :min="0"
              v-model:value="form.attempt"
              :placeholder="t('validation.placeholder', { name: t('menu.offers.form.attempt') })"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('menu.offers.form.date')" name="dateRange">
            <a-range-picker
              size="large"
              class="w-full"
              v-model:value="form.dateRange"
              :format="formatDate"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('menu.offers.form.discount')" name="discount">
            <a-input-number
              size="large"
              class="w-full"
              :min="0"
              v-model:value="form.discount"
              :placeholder="t('validation.placeholder', { name: t('menu.offers.form.discount') })"
            >
              <template #addonAfter><PercentageOutlined /></template>
            </a-input-number>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('common.status')" name="status">
            <a-radio-group v-model:value="formData.status">
              <a-radio-button :value="true">{{ t('common.active') }}</a-radio-button>
              <a-radio-button :value="false">{{ t('common.inactive') }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>

      <BaseEditor
        :label="t('menu.offers.form.terms')"
        name="terms"
        v-model="formData.terms"
        :height="300"
        placeholder="Write something..."
      />
    </template>
  </BaseDrawerForm>
</template>

<style scoped></style>
