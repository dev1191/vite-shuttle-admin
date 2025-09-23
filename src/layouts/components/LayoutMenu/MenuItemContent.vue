<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const { t } = useI18n()
</script>

<template>
  <span class="ml10px text-14px" :title="item?.title || item?.meta?.title">
    <component v-if="item?.icon" :is="item.icon" class="mr-2" />
    {{ item?.title || item?.meta?.title || 'Unknown' }}
  </span>
</template>

<style scoped></style>
