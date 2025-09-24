<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
// import { useSidebarMenu } from '@/composables/useSidebarMenu'
import SubMenuItem from './SubMenuItem.vue'
// import { isPermitted } from '@/utils/permission'
// import { routes } from 'vue-router/auto-routes'

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

const selectedKeys = ref([])
const openKeys = ref([])

const { items } = useSidebarMenu(props.userRole)
const menuItems = items

// 获取当前打开的子菜单
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
  <div class="mt-3">
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
        <SubMenuItem :item="item" />
      </template>
    </a-menu>
  </div>
</template>

<style scoped></style>
