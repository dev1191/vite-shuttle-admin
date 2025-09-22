<script setup lang="ts">
import { useLayoutSettingStore } from '@/stores/modules/layout.store'
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons-vue'
import LayoutTitle from './components/LayoutTitle.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'

const collapsed = ref(false)
const { layoutSetting, theme, border } = useLayoutSettingStore()

const sidemenuWidth = computed(() => layoutSetting.sidemenuWidth)
const menuTheme = computed(() => layoutSetting.menuTheme)
const showTitle = computed(() => layoutSetting.showTitle)
const showHeader = computed(() => layoutSetting.showHeader)
const showFooter = computed(() => layoutSetting.showFooter)
</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :width="sidemenuWidth"
      :collapsedWidth="60"
      :collapsible="true"
      :trigger="null"
      :theme="menuTheme"
    >
      <LayoutTitle v-if="showTitle" :collapsed="collapsed" />
    </a-layout-sider>
    <a-layout class="app-main">
      <div class="app-header">
        <LayoutHeader v-if="showHeader" v-model:collapsed="collapsed" />
      </div>

      <div class="app-content">
        <router-view v-slot="{ Component, route }">
          <transition name="route" mode="out-in">
            <div :key="route.name">
              <component :is="Component" class="relative" />
            </div>
          </transition>
        </router-view>
      </div>
      <LayoutFooter v-if="showFooter" />
    </a-layout>
  </a-layout>
</template>

<style scoped>
.app-layout {
  height: 100vh;
}
.app-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow: auto;

  .app-header {
    position: sticky;
    top: 0;
    z-index: 200;
    flex-shrink: 0;
    width: 100%;
  }
  .app-content {
    flex: 1;
    min-height: 0;
    overflow: auto;
    background: var(--app-content-background);
    padding: 24px;
  }
}
</style>
