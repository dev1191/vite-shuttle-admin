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
  <div>
    <a-layout class="h100vh overflow-hidden">
      <a-layout-sider
        v-model:collapsed="collapsed"
        :width="sidemenuWidth"
        :collapsedWidth="60"
        :collapsible="true"
        :trigger="null"
        :theme="menuTheme"
        :style="{ borderRight: border }"
      >
        <LayoutTitle v-if="showTitle" :collapsed="collapsed" />
      </a-layout-sider>
      <a-layout>
        <LayoutHeader v-if="showHeader" v-model:collapsed="collapsed" />
        <a-layout-content>
          <RouterView />
        </a-layout-content>
        <LayoutFooter v-if="showFooter" />
      </a-layout>
    </a-layout>
  </div>
</template>

<style scoped></style>
