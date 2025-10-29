<script setup lang="ts">
import { computed } from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  BellOutlined,
  MessageOutlined,
  GlobalOutlined,
  SettingOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import LayoutBreadcrumb from './LayoutBreadcrumb.vue'
import LayoutSetting from './LayoutSetting.vue'
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

// Props
interface Props {
  collapsed: boolean
}
const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

// Store
const layoutSettingStore = useLayoutSettingStore()
const { layoutSetting, headerBackground, headerColor, border } = layoutSettingStore

// Computed
const layoutTopmenu = computed(() => layoutSetting.layout === 'topmenu')
const showBreadcrumb = computed(() => layoutSetting.showBreadcrumb)
const showSetting = computed(() => layoutSetting.showSetting)

const pageHeaderStyle = computed<Record<string, string>>(() => ({
  borderBottom: border,
}))
</script>

<template>
  <APageHeader :ghost="true" class="relative navbar z-100">
    <!-- Left Section -->
    <template #title>
      <div class="flex items-center gap-4">
        <!-- Collapse Button -->
        <span
          v-if="!layoutTopmenu"
          class="cursor-pointer text-xl flex items-center"
          @click="emit('update:collapsed', !props.collapsed)"
        >
          <component :is="props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
        </span>

        <!-- Breadcrumb -->
        <LayoutBreadcrumb v-if="showBreadcrumb" />
      </div>
    </template>

    <!-- Right Section -->
    <template #extra>
      <div class="flex items-center gap-6">
        <!-- Profile + Settings -->
        <ThemeSwitch />

        <LanguageSwitch />
        <UserProfile />
        <LayoutSetting v-if="showSetting" />
      </div>
    </template>
  </APageHeader>
</template>

<style scoped>
.navbar {
  border-bottom: solid 1px #dcdcdc;
  padding-bottom: 0.4rem;
}
</style>
