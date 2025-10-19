<script setup lang="ts">
import { formatDate } from '@/utils'

const props = defineProps({
  visible: { type: Boolean, default: false },
  item: { type: Object, required: true },
})

const emit = defineEmits(['update:visible'])
const { t } = useI18n()

const { renderTag } = useRender()

const handleCancel = () => {
  emit('update:visible', false)
}

const ticketStatus = (text: string) => {
  const ticketStatusEnum = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    REPLIED: 'Replied',
    CLOSED: 'Closed',
  } as const

  const statusColorMap: Record<string, string> = {
    OPEN: 'red',
    IN_PROGRESS: 'processing',
    REPLIED: 'warning',
    CLOSED: 'success',
  }

  const upperText = text.toUpperCase() as keyof typeof ticketStatusEnum
  console.log('Status upperText:', upperText) // Debugging line
  const color = statusColorMap[upperText] || 'default'
  return renderTag(ticketStatusEnum[upperText], color, 'ticketStatus')
}
</script>

<template>
  <a-modal
    :open="props.visible"
    width="50%"
    centered
    :title="t('common.details', { name: t('menu.helpAndSupports.title') })"
    @cancel="handleCancel"
  >
    <template #footer>
      <a-button key="back" danger @click="handleCancel">
        {{ t('common.close') }}
      </a-button>
    </template>

    <a-descriptions bordered layout="vertical">
      <a-descriptions-item :label="t('menu.helpAndSupports.form.ticketNo')" class="font-bold">
        {{ props.item.ticket_no }}
      </a-descriptions-item>
      <a-descriptions-item :label="t('menu.helpAndSupports.form.name')">
        {{ props.item.firstname }} {{ props.item.lastname }} ({{ props.item.email }})
      </a-descriptions-item>
      <a-descriptions-item :label="t('menu.helpAndSupports.form.phone')">
        {{ props.item.phone }}
      </a-descriptions-item>

      <a-descriptions-item :span="2" :label="t('common.createdAt')">
        {{ formatDate(props.item.createdAt) }}
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.status')">
        {{ props.item.status }}
      </a-descriptions-item>
      <a-descriptions-item :span="3" :label="t('menu.helpAndSupports.form.description')">
        {{ props.item.description }}
      </a-descriptions-item>

      <a-descriptions-item :label="t('menu.helpAndSupports.form.replies')">
        <a-descriptions bordered :column="1" class="mt-2">
          <a-descriptions-item :label="t('menu.helpAndSupports.form.subject')">
            {{ props.item.replies.subject }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('menu.helpAndSupports.form.message')">
            {{ props.item.replies.message }}
          </a-descriptions-item>
        </a-descriptions>
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>
