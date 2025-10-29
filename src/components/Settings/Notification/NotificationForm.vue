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
const { t } = useI18n()

const addNotificationForm = ref<FormInstance>()
const isLoading = ref(false)

const newNotification = reactive({
  setEnabled: true,
  firebase_key: null as File | null,
})

watch(
  () => props.item,
  (val) => {
    if (val) Object.assign(newNotification, val)
  },
  { immediate: true },
)

const rules = {
  firebase_key: [{ required: true, message: 'Firebase Key is required' }],
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
    emit('submit', newNotification)
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
        <a-form-item label="Set Enabled" name="setEnabled">
          <a-switch v-model:checked="newNotification.setEnabled" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12">
        <a-form-item label="Firebase Key (.json)" name="firebase_key">
          <a-upload
            :beforeUpload="beforeUpload"
            :maxCount="1"
            accept=".json"
            :showUploadList="true"
            :fileList="newNotification.firebase_key ? [{ name: newNotification.firebase_key }] : []"
          >
            <a-button>Click or Drop Firebase .json File</a-button>
          </a-upload>
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Submit Button -->
    <div class="flex gap-2 flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center">
      <a-button size="large" type="primary" :loading="isLoading" @click="onSave">{{
        t('common.submit')
      }}</a-button>
    </div>
  </a-form>
</template>
