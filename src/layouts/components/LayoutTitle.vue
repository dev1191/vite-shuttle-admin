<script setup lang="ts">
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

defineProps({
  collapsed: {
    type: Boolean,
  },
})

const { layoutSetting, titleColor } = useLayoutSettingStore()
const title = computed(() => layoutSetting.title)

const style = computed(() => {
  return {
    paddingLeft: '10px',
    height: `var(--app-header-height)`,
    color: titleColor.value,
  }
})
</script>

<template>
  <div class="flex-cc overflow-hidden whitespace-nowrap font-500 text-20px" :style="style">
    <img class="h32px mr10px" src="#" alt="" />
    <div v-show="!collapsed">
      {{ title }}
    </div>
  </div>
</template>
