<script setup lang="ts">
import type { Pass } from '@/types/passes'
import type { Rule } from 'ant-design-vue/es/form'
import { PercentageOutlined } from '@ant-design/icons-vue'

interface Props {
  isEdit: boolean
  isLoading: boolean
}
const props = defineProps<Props>()

const { t } = useI18n()
const drawerRef = ref()
const drawerVisible = ref(false)
const isEdit = ref(props.isEdit)
const loading = ref(false)

interface Emits {
  (e: 'submit', formData: Pass): void
}
const emit = defineEmits<Emits>()

const formData = reactive<Pass>({
  no_of_rides: 0,
  no_of_valid_days: 0,
  price_per_km: '',
  discount: 0,
  terms: '',
  description: '',
  status: true,
})

const rules: Record<string, Rule[]> = {
  no_of_rides: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.passes.form.noOfRides'),
      }),
      trigger: 'blur',
    },
  ],
  no_of_valid_days: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.passes.form.validDays'),
      }),
      trigger: 'blur',
    },
  ],
  price_per_km: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.passes.form.discount') }),
      trigger: 'blur',
    },
    {
      validator: (_rule: any, value: any) => {
        if (value === '' || value === null || value === undefined) {
          return Promise.reject(t('validation.required', { name: t('menu.passes.form.discount') }))
        }
        // allow only numeric and decimal values
        if (!/^\d+(\.\d+)?$/.test(String(value))) {
          return Promise.reject(t('validation.numberDecimalOnly'))
        }
        return Promise.resolve()
      },
      trigger: ['blur', 'change'],
    },
  ],
  discount: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.passes.form.discount') }),
      trigger: 'blur',
    },
  ],
}

function openDrawer(edit = false, record?: Pass) {
  isEdit.value = edit
  drawerVisible.value = true
  if (edit && record) Object.assign(formData, record)
}

function handleClose() {
  drawerVisible.value = false
  Object.assign(formData, {
    ids: '',
    no_of_rides: 0,
    no_of_valid_days: 0,
    price_per_km: '',
    discount: 0,
    terms: '',
    description: '',
    status: true,
  })
}

async function handleSubmit(formData: Pass) {
  try {
    loading.value = true
    emit('submit', formData)
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
    :title="isEdit ? 'Edit Pass' : 'Create Pass'"
    :formData="formData"
    :loading="props.isLoading"
    :width="950"
    :isEdit="isEdit"
    :rules="rules"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #fields="{ form }">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item :label="t('menu.passes.form.noOfRides')" name="no_of_rides">
            <a-input-number
              size="large"
              class="w-full"
              v-model:value="form.no_of_rides"
              :min="0"
              :placeholder="t('validation.placeholder', { name: t('menu.passes.form.noOfRides') })"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="t('menu.passes.form.validDays')" name="no_of_valid_days">
            <a-input-number
              size="large"
              class="w-full"
              :min="0"
              v-model:value="form.no_of_valid_days"
              :placeholder="t('validation.placeholder', { name: t('menu.passes.form.validDays') })"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="t('menu.passes.form.pricePerKm')" name="price_per_km">
            <a-input
              size="large"
              class="w-full"
              v-model:value="form.price_per_km"
              :placeholder="t('validation.placeholder', { name: t('menu.passes.form.pricePerKm') })"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('menu.passes.form.discount')" name="discount">
            <a-input-number
              size="large"
              class="w-full"
              :min="0"
              v-model:value="form.discount"
              :placeholder="t('validation.placeholder', { name: t('menu.passes.form.discount') })"
            >
              <template #addonAfter><PercentageOutlined /></template>
            </a-input-number>
          </a-form-item>
        </a-col>
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
        :label="t('menu.passes.form.description')"
        name="description"
        v-model="formData.description"
        :height="300"
        placeholder="Write something..."
      />

      <BaseEditor
        :label="t('menu.passes.form.terms')"
        name="terms"
        v-model="formData.terms"
        :height="300"
        placeholder="Write something..."
      />
    </template>
  </BaseDrawerForm>
</template>

<style scoped></style>
