<script setup lang="ts">
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

const { t } = useI18n()

const { layoutSetting } = useLayoutSettingStore()
const direction = computed(() => (layoutSetting.direction == 'ltr' ? 'right' : 'left'))
const formRef = ref()
const props = defineProps({
  title: { type: String, default: 'Drawer Form' },
  visible: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  formData: { type: Object, required: true },
  width: { type: [String, Number], default: 480 },
  rules: { type: Object, required: true },
})

const emit = defineEmits(['close', 'submit'])

function handleClose() {
  emit('close')
}

const handleSubmit = async () => {
  // Validation passed
  formRef.value
    .validate()
    .then(() => {
      emit('submit', props.formData)
    })
    .catch((error: any) => {
      console.log('error', error)
    })
}
const handleFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<template>
  <a-drawer
    maskClosable
    :open="visible"
    :title="title"
    :width="width"
    :destroyOnClose="true"
    @close="handleClose"
    :placement="direction"
  >
    <a-form layout="vertical" ref="formRef" :rules="rules" :model="formData">
      <!-- slot for form fields -->
      <slot name="fields" :form="formData"></slot>
    </a-form>
    <template #extra>
      <a-space>
        <a-button size="large" @click="handleClose">Cancel</a-button>
        <a-button size="large" type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? t('common.update') : t('common.create') }}
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<style scoped>
.flex {
  display: flex;
}
.gap-2 {
  gap: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
