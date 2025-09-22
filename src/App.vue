<script setup lang="ts">
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

const { theme } = useLayoutSettingStore()
</script>

<template>
  <AConfigProvider :theme="theme" :direction="theme.direction">
    <!-- Transition for route changes -->
    <router-view v-slot="{ Component, route }">
      <transition name="slide">
        <component :is="Component" :key="route" />
      </transition>
    </router-view>
  </AConfigProvider>
</template>

<style scoped></style>
