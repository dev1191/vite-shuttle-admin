<script setup lang="ts">
import { ref, watch } from 'vue'
import { themeAlgorithmOptions } from '@/settings/layout.setting'
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

const layoutSettingStore = useLayoutSettingStore()

// state for switch (true = dark, false = light)
const isDark = ref(layoutSettingStore.layoutSetting.algorithm === 'darkAlgorithm')

// watch for changes
watch(isDark, (val) => {
  const newTheme = val ? 'darkAlgorithm' : 'defaultAlgorithm'
  layoutSettingStore.updateLayoutSetting({ algorithm: newTheme })
})

// get icons from themeAlgorithmOptions
const lightIcon = themeAlgorithmOptions.find((opt) => opt.value === 'defaultAlgorithm')?.icon
const darkIcon = themeAlgorithmOptions.find((opt) => opt.value === 'darkAlgorithm')?.icon
</script>

<template>
  <a-space direction="vertical">
    <a-switch v-model:checked="isDark" size="default">
      <template #checkedChildren>
        <component :is="darkIcon" class="mt-0.4" />
      </template>
      <template #unCheckedChildren>
        <component :is="lightIcon" />
      </template>
    </a-switch>
  </a-space>
</template>
