<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'

interface Props {
  item: any
  isLoading: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'submit', newStorage: any): void
}
const emit = defineEmits<Emits>()

const addGeneralForm = ref<FormInstance>()

const newStorage = reactive({
  name: '',
  cloudinary: {
    cloud_name: '',
    api_key: '',
  },
  spaces: {
    access_key: '',
    secret_key: '',
    region: '',
    bucket: '',
    endpoint_url: '',
    cdn_url: '',
  },
})
watch(
  () => props.item,
  (val) => {
    if (val) Object.assign(newStorage, val)
  },
  { immediate: true },
)

const options = [
  { label: 'Cloudinary', value: 'cloudinary' },
  { label: 'Spaces', value: 'spaces' },
  { label: 'Local', value: 'local' },
]

const rules = {
  name: [{ required: true, message: 'Please select a storage type' }],
}

const onSave = async () => {
  try {
    await addGeneralForm.value?.validate()
    emit('submit', newStorage)
  } catch (error) {
    console.log('Validation failed:', error)
  }
}
</script>

<template>
  <a-form
    ref="addGeneralForm"
    layout="vertical"
    :model="newStorage"
    :rules="rules"
    class="flex flex-col gap-4 w-full"
  >
    <!-- Select Storage -->
    <a-form-item label="Default File Storage" name="name" class="w-full sm:w-1/2">
      <a-select
        size="large"
        v-model:value="newStorage.name"
        :options="options"
        placeholder="Select Storage Type"
      />
    </a-form-item>

    <!-- Cloudinary Fields -->
    <template v-if="newStorage.name === 'cloudinary'">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12">
          <a-form-item label="Cloud Name" name="cloud_name">
            <a-input size="large" v-model:value="newStorage.cloudinary.cloud_name" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="API Key" name="api_key">
            <a-input size="large" v-model:value="newStorage.cloudinary.api_key" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="Access Key" name="access_key">
            <a-input size="large" v-model:value="newStorage.spaces.access_key" />
          </a-form-item>
        </a-col>
      </a-row>
    </template>

    <!-- Spaces Fields -->
    <template v-if="newStorage.name === 'spaces'">
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12">
          <a-form-item label="Access Key" name="access_key">
            <a-input size="large" v-model:value="newStorage.spaces.access_key" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="Secret Key" name="secret_key">
            <a-input size="large" v-model:value="newStorage.spaces.secret_key" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="Region" name="region">
            <a-input size="large" v-model:value="newStorage.spaces.region" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="Bucket" name="bucket">
            <a-input size="large" v-model:value="newStorage.spaces.bucket" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="Endpoint URL" name="endpoint_url">
            <a-input size="large" v-model:value="newStorage.spaces.endpoint_url" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="12">
          <a-form-item label="CDN URL" name="cdn_url">
            <a-input size="large" v-model:value="newStorage.spaces.cdn_url" />
          </a-form-item>
        </a-col>
      </a-row>
    </template>

    <!-- Submit Button -->
    <div class="flex gap-2 flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center">
      <a-button size="large" type="primary" :loading="props.isLoading" @click="onSave">
        Submit
      </a-button>
    </div>
  </a-form>
</template>
