<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LockOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue'
import LayoutBreadcrumb from './LayoutBreadcrumb.vue'
import { useLayoutSettingStore } from '@/stores/modules/layout.store'
import LayoutSetting from './LayoutSetting.vue'

defineProps({
  collapsed: {
    type: Boolean,
  },
})

const { t } = useI18n()
const layoutSettingStore = useLayoutSettingStore()
const layoutSetting = layoutSettingStore.layoutSetting
const layout_sidemenu = computed(() => layoutSetting.layout === 'sidemenu')
const layout_topmenu = computed(() => layoutSetting.layout === 'topmenu')
const layout_mixinmenu = computed(() => layoutSetting.layout === 'mixinmenu')
const showBreadcrumb = computed(() => layoutSetting.showBreadcrumb)
const showSearchMenu = computed(() => layoutSetting.showSearchMenu)
const showLockScreen = computed(() => layoutSetting.showLockScreen)
const showFullScreen = computed(() => layoutSetting.showFullScreen)
const showSetting = computed(() => layoutSetting.showSetting)
const showRefreshReset = computed(() => layoutSetting.showRefreshReset)
const locale = computed(() => layoutSetting.locale)
const sidemenuWidth = computed(() => layoutSetting.sidemenuWidth)
const headerBackground = computed(() => layoutSettingStore.headerBackground)
const headerColor = computed(() => layoutSettingStore.headerColor)
const border = computed(() => layoutSettingStore.border)

const emit = defineEmits(['update:collapsed'])

const layoutHeaderStyle = computed(() => {
  return {
    height: 'var(--app-header-height)',
    padding: layout_sidemenu.value ? '0 20px' : '0 20px 0 0',
    background: headerBackground.value,
    color: headerColor.value,
    borderBottom: border.value,
  }
})
</script>

<template>
  <a-layout-header class="flex-bc" :style="layoutHeaderStyle">
    <div :style="{ width: `${sidemenuWidth}px` }" v-if="!layout_sidemenu">
      <slot name="title"></slot>
    </div>
    <div :style="{ paddingLeft: layout_mixinmenu ? '20px' : 0 }" v-if="!layout_topmenu">
      <slot name="left"> </slot>
      <a-space :size="20" v-if="!layout_topmenu">
        <span class="cursor-pointer" @click="() => emit('update:collapsed', !collapsed)">
          <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
        </span>
        <LayoutBreadcrumb v-if="showBreadcrumb" />
      </a-space>
    </div>
    <div class="flex-cc flex-1">
      <slot name="menu" />
    </div>
    <div>
      <a-space :size="20">
        <!-- <SearchMenu v-if="showSearchMenu" />

        <LocaleLanguage v-if="locale" />
      
        <-->
        <UserProfile />
        <LayoutSetting v-if="showSetting" />
      </a-space>
    </div>
  </a-layout-header>
</template>

<style lang="less" scoped></style>
