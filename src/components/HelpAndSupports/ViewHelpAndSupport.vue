<script setup lang="ts">
const props = defineProps({
  visible: { type: Boolean, default: false },
  item: { type: Object, required: true },
})

const emit = defineEmits(['update:visible'])
const { t } = useI18n()

const handleCancel = () => {
  emit('update:visible', false)
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

    <a-descriptions bordered :column="1" size="middle">
      <a-descriptions-item :label="t('menu.helpAndSupports.form.ticketNo')">
        {{ props.item.ticket_no }}
      </a-descriptions-item>
      <a-descriptions-item :label="t('menu.helpAndSupports.form.name')">
        {{ props.item.firstname }} {{ props.item.lastname }}
      </a-descriptions-item>
      <a-descriptions-item :label="t('menu.helpAndSupports.form.gender')">
        {{ props.item.gender }}
      </a-descriptions-item>
      <a-descriptions-item :label="t('menu.helpAndSupports.form.email')">
        {{ props.item.email }}
      </a-descriptions-item>
      <a-descriptions-item :label="t('menu.helpAndSupports.form.phone')">
        {{ props.item.phone }}
      </a-descriptions-item>
      <a-descriptions-item :label="t('menu.helpAndSupports.form.description')">
        {{ props.item.description }}
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.createdAt')">
        {{ props.item.createdAt }}
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>
