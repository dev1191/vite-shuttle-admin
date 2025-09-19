<script setup lang="ts">
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

const layoutThemeStore = useLayoutSettingStore()
const copyright = computed(() => layoutThemeStore.layoutSetting.copyright)
</script>

<template>
  <a-layout-footer>
    <a-card class="text-center"> Copyright ©2025 {{ copyright }} </a-card>
  </a-layout-footer>
</template>

<style lang="less" scoped></style>
