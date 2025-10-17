<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const formRef = ref()

const props = defineProps({
  title: { type: String, default: 'Modal Form' },
  visible: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  formData: { type: Object, required: true },
  width: { type: [String, Number], default: 500 },
  rules: { type: Object, required: true },
})

const emit = defineEmits(['close', 'submit'])

function handleClose() {
  emit('close')
}

const handleSubmit = async () => {
  formRef.value
    .validate()
    .then(() => {
      emit('submit', props.formData)
    })
    .catch((error: any) => {
      console.log('Validation failed:', error)
    })
}

const handleFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<template>
  <a-modal
    :open="visible"
    :title="title"
    :width="width"
    centered
    maskClosable
    destroyOnClose
    @cancel="handleClose"
    :footer="null"
  >
    <a-form
      layout="vertical"
      ref="formRef"
      :rules="rules"
      :model="formData"
      @finishFailed="handleFailed"
    >
      <!-- Slot for form fields -->
      <slot name="fields" :form="formData"></slot>

      <div class="flex justify-end gap-2 mt-4">
        <a-button size="large" @click="handleClose" danger>
          {{ t('common.cancel') }}
        </a-button>
        <a-button size="large" type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? t('common.update') : t('common.create') }}
        </a-button>
      </div>
    </a-form>
  </a-modal>
</template>

<style scoped>
.flex {
  display: flex;
}
.justify-end {
  justify-content: flex-end;
}
.gap-2 {
  gap: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
