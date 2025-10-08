<script setup lang="ts">
import { placements } from 'ant-design-vue/es/vc-tour/placements'

const { t } = useI18n()

const placement = ref('right')

const props = defineProps({
  title: { type: String, default: 'Drawer Form' },
  visible: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  formData: { type: Object, required: true },
  width: { type: [String, Number], default: 480 },
})

const emit = defineEmits(['close', 'submit'])

function handleClose() {
  emit('close')
}

function handleSubmit() {
  emit('submit', props.formData)
}
</script>

<template>
  <a-drawer
    :open="visible"
    :title="title"
    :width="width"
    :destroyOnClose="true"
    @close="handleClose"
    :placement="placement"
  >
    <a-form layout="vertical" :model="formData" @submit.prevent="handleSubmit">
      <!-- slot for form fields -->
      <slot name="fields" :form="formData"></slot>

      <div class="flex justify-between mt-4 gap-2">
        <a-button size="large" block @click="handleClose">Cancel</a-button>
        <a-button size="large" block type="primary" html-type="submit" :loading="loading">
          {{ isEdit ? t('common.update') : t('common.create') }}
        </a-button>
      </div>
    </a-form>
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
