<script setup lang="ts">
import { useLayoutSettingStore } from '@/stores/modules/layout.store'
import { useUserStore } from '@/stores/modules/user.store'

defineProps({
  collapsed: {
    type: Boolean,
  },
})

const { layoutSetting, titleColor } = useLayoutSettingStore()
const userStore = useUserStore()
const title = computed(() => userStore.generalSetting.name || layoutSetting.title)
const logo = computed(() =>
  layoutSetting.algorithm === 'darkAlgorithm'
    ? userStore.generalSetting.dark_logo
    : userStore.generalSetting.white_logo,
)
const style = computed(() => {
  return {
    paddingLeft: '10px',
    height: `var(--app-header-height)`,
  }
})
</script>

<template>
  <div
    class="flex flex-row overflow-hidden whitespace-nowrap font-500 text-20px gap-2 p-2"
    :style="style"
  >
    <img class="h42px mr10px" :src="logo" alt="" />
    <div v-show="!collapsed" class="mt-2">
      {{ title }}
    </div>
  </div>
</template>
