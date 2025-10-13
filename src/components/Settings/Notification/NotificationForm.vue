<script setup lang="ts">
import type { FormInstance, UploadProps } from 'ant-design-vue'

interface Props {
  item: any
  isLoading: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'submit', newStorage: any): void
}
const emit = defineEmits<Emits>()

const addNotificationForm = ref<FormInstance>()
const isLoading = ref(false)

const newNotification = reactive({
  otp_validation_via: false,
  firebase_database_url: '',
  firebase_key: null as File | null,
})

const rules = {
  firebase_database_url: [{ required: true, message: 'Firebase Database URL is required' }],
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJson = file.type === 'application/json'
  if (!isJson) {
    window.$message?.error('You can only upload JSON files!')
  } else {
    newNotification.firebase_key = file
  }
  return false // prevent auto-upload
}

const onSave = async () => {
  try {
    await addNotificationForm.value?.validate()
    isLoading.value = true
    console.log('Submitted:', newNotification)
    // handle submit logic here
  } catch (error) {
    console.log('Validation failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <a-form
    ref="addNotificationForm"
    layout="vertical"
    :model="newNotification"
    :rules="rules"
    class="flex flex-col gap-4 w-full"
  >
    <!-- Switch + URL -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12">
        <a-form-item label="Is Production" name="otp_validation_via">
          <a-switch v-model:checked="newNotification.otp_validation_via" />
        </a-form-item>
      </a-col>

      <a-col :xs="24" :sm="12">
        <a-form-item
          label="Firebase Database URL"
          name="firebase_database_url"
          :rules="rules.firebase_database_url"
        >
          <a-input
            v-model:value="newNotification.firebase_database_url"
            placeholder="Enter Firebase URL"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <!-- File Upload -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12">
        <a-form-item label="Firebase Key (.json)" name="firebase_key">
          <a-upload
            :beforeUpload="beforeUpload"
            :maxCount="1"
            accept=".json"
            :showUploadList="true"
            :fileList="
              newNotification.firebase_key ? [{ name: newNotification.firebase_key.name }] : []
            "
          >
            <a-button>Click or Drop Firebase .json File</a-button>
          </a-upload>
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Submit Button -->
    <div class="flex gap-2 flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center">
      <a-button type="primary" :loading="isLoading" @click="onSave">Submit</a-button>
    </div>
  </a-form>
</template>
