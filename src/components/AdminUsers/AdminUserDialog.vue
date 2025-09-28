<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  visible: boolean
  type: string
  userData?: any
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// ✅ Correct way to use i18n
const { t } = useI18n()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const title = computed(() => (props.type === 'add' ? t('common.add') : t('common.edit')))
</script>

<template>
  <a-dialog v-model:open="dialogVisible" :title="title" width="30%" centered>
    <!-- your form goes here -->
  </a-dialog>
</template>

<style scoped></style>
