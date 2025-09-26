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
  <div class="flex items-center px-3 py-2">
    <!-- Icon -->
    <component v-if="item?.icon" :is="item.icon" class="mr-3" />

    <!-- Text -->
    <span class="text-md font-medium" :label="item?.label || item?.meta?.label">
      {{ item?.label || item?.meta?.label || 'Unknown' }}
    </span>
  </div>
</template>

<style scoped></style>
