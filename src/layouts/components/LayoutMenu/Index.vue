<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSidebarMenu } from '@/composables/useSidebarMenu'
import SubMenuItem from './SubMenuItem.vue'

const props = defineProps({
  collapsed: {
    type: Boolean,
  },
  userRole: {
    type: String,
    default: 'admin',
  },
})
const currentRoute = useRoute()
const router = useRouter()

const { sidebarMenu } = useSidebarMenu(props.userRole)
const menuItems = sidebarMenu

// Reactive menu state
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

const getOpenKeys = () =>
  currentRoute.meta.namePath ?? currentRoute.matched.slice(1).map((item) => item.name)

const getRouteByName = (name) => router.getRoutes().find((item) => item.name === name)

// 监听菜单收缩状态
watch(
  () => props.collapsed,
  () => {
    selectedKeys.value = currentRoute.name ? [currentRoute.name] : []
    openKeys.value = getOpenKeys()
  },
)

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    selectedKeys.value = currentRoute.name ? [currentRoute.name] : []
    openKeys.value = getOpenKeys()
  },
  {
    immediate: true,
  },
)

const clickMenuItem = ({ key }) => {
  if (key === currentRoute.name) return
  const preSelectedKeys = selectedKeys.value
  const targetRoute = getRouteByName(key)
  const { outsideLink } = targetRoute?.meta || {}
  if (targetRoute && outsideLink) {
    nextTick(() => {
      selectedKeys.value = preSelectedKeys
    })
  }
}
</script>

<template>
  <div>
    <a-menu
      class="border-none!"
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      theme="light"
      collapsible
      :inline-collapsed="collapsed"
      @click="clickMenuItem"
    >
      <template v-for="item in menuItems" :key="item.name">
        <!-- Submenu with children -->
        <SubMenuItem :item="item" />
      </template>
    </a-menu>
  </div>
</template>

<style scoped></style>
