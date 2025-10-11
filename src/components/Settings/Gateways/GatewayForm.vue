<script setup lang="ts">
import type { Gateway } from '@/types'
const { t } = useI18n()

const emit = defineEmits(['close', 'submit'])

const props = defineProps({
  visible: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  gateway: { type: Object, required: true },
})

const formData = reactive<Gateway>({
  site: '',
  data: {
    key: '',
    secret: '',
    username: '',
    password: '',
    integration_id: '',
    frame_id: '',
    mode: '',
    is_enabled: 1,
  },
})

// ✅ Dynamic validation rules
const rules = {
  username: [
    {
      validator: (_: any, value: string) => {
        if (formData.site !== 'Paymob') return Promise.resolve()
        if (!value) return Promise.reject('Please enter username')
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (_: any, value: string) => {
        if (formData.site !== 'Paymob') return Promise.resolve()
        if (!value) return Promise.reject('Please enter password')
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
  key: [
    {
      validator: (_: any, value: string) => {
        if (formData.site === 'Cash') return Promise.resolve()
        if (!value) return Promise.reject('Please enter API key')
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
  secret: [
    {
      validator: (_: any, value: string) => {
        if (formData.site === 'Cash') return Promise.resolve()
        if (!value) return Promise.reject('Please enter secret key')
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
  site: [{ required: true, message: 'Please enter site name', trigger: 'blur' }],
}

const initFormData = () => {
  const row = props.gateway
  Object.assign(formData, {
    site: row?.site || '',
    username: row?.data?.username || '',
    password: row?.data?.password || '',
    key: row?.data?.key || '',
    secret: row?.data?.secret || '',
    mode: row?.data?.mode || '',
    is_enabled: row?.data?.is_enabled || '',
    integration_id: row?.data?.integration_id || '',
    frame_id: row?.data?.frame_id || '',
  })
}

const handleSubmit = (data: any) => {
  emit('submit', data)
}

watch(
  () => [props.visible, props.gateway],
  ([visible]) => {
    if (visible) initFormData()
  },
  { immediate: true },
)
</script>

<template>
  <BaseModalForm
    :title="
      isEdit ? `Edit Gateway : ${props.gateway?.site}` : `Create Gateway : ${props.gateway?.site}`
    "
    :visible="visible"
    :isEdit="isEdit"
    :formData="formData"
    :rules="rules"
    :loading="loading"
    @close="$emit('close')"
    @submit="handleSubmit"
  >
    <template #fields="{ form }">
      <a-row :gutter="16" v-show="form.site === 'Paymob' && form.site === 'Paymob'">
        <a-col :span="12">
          <a-form-item label="Username" name="username">
            <a-input size="large" v-model:value="form.username" placeholder="Enter username" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Password" name="password">
            <a-input size="large" v-model:value="form.password" placeholder="Enter password" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="Key" name="key" v-show="form.site !== 'Cash'">
        <a-input size="large" v-model:value="form.key" placeholder="Enter public key" />
      </a-form-item>

      <a-form-item label="Secret" name="secret" v-show="form.site !== 'Cash'">
        <a-input size="large" v-model:value="form.secret" placeholder="Enter secret key" />
      </a-form-item>

      <a-form-item label="Mode" name="mode" v-show="form.site !== 'Cash'">
        <a-select size="large" v-model:value="form.mode" placeholder="Select mode">
          <a-select-option value="sandbox">Sandbox</a-select-option>
          <a-select-option value="live">Live</a-select-option>
        </a-select>
      </a-form-item>
      <a-row :gutter="16" v-show="form.site === 'Paymob' && form.site === 'Paymob'">
        <a-col :span="12">
          <a-form-item label="Integration Id" name="integration_id">
            <a-input
              size="large"
              v-model:value="form.integration_id"
              placeholder="Enter integration id"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Frame Id" name="frame_id">
            <a-input size="large" v-model:value="form.frame_id" placeholder="Enter frame id" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="Status" name="is_enabled">
        <a-radio-group v-model:value="form.is_enabled">
          <a-radio-button value="1">{{ t('common.yes') }}</a-radio-button>
          <a-radio-button value="0">{{ t('common.no') }}</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </template>
  </BaseModalForm>
</template>
