<script setup lang="ts">
import { useSidebarMenu } from '@/composables/useSidebarMenu'
import type { IMenuItem } from '@/types/menu'
import { getRoleMenu } from '@/utils/router'

const props = defineProps({
  collapsed: Boolean,
  userRole: {
    type: String,
    default: 'admin',
  },
})

const currentRoute = useRoute()
const router = useRouter()

const selectedKeys = ref<string[]>(['dashboard'])
const openKeys = ref<string[]>(['dashboard'])

const { defaultMenus } = useSidebarMenu(props.userRole)
const menuItems = ref<IMenuItem[]>([])
const loading = ref(true)

onMounted(async () => {
  // simulate async fetch or preparation
  await new Promise((resolve) => setTimeout(resolve, 800))
  menuItems.value = [...defaultMenus]
  loading.value = false
})

const flashTimer = ref<number | null>(null)
const flashMenu = (key: string) => {
  openKeys.value = [key]
  if (!props.collapsed) return
  if (flashTimer.value) window.clearTimeout(flashTimer.value)
  flashTimer.value = window.setTimeout(() => (openKeys.value = []), 800)
}

watch(
  () => currentRoute.path,
  (path) => {
    const findMenuKey = (items: IMenuItem[], path: string): string | undefined => {
      for (const item of items) {
        if (item.path === path) return item.key
        if (item.children) {
          const key = findMenuKey(item.children, path)
          if (key) {
            flashMenu(item.key)
            return key
          }
        }
      }
      return undefined
    }
    const key = findMenuKey(menuItems.value, path)
    if (key) selectedKeys.value = [key]
  },
  { immediate: true },
)

const handleMenuClick = (key: string) => {
  const findPath = (items: IMenuItem[]): string | undefined => {
    for (const item of items) {
      if (item.key.toLowerCase() === key.toLowerCase()) return item.path
      if (item.children) {
        const path = findPath(item.children)
        if (path) return path
      }
    }
    return undefined
  }
  const path = findPath(menuItems.value)
  if (path) router.push(path)
}
</script>

<template>
  <div class="mt-3 h-full">
    <!-- Sidebar menu -->
    <a-menu
      :inline-collapsed="collapsed"
      mode="inline"
      :selectedKeys="selectedKeys"
      :openKeys="openKeys"
      @select="({ key }) => handleMenuClick(key as string)"
      style="height: 100%"
    >
      <template v-for="item in menuItems" :key="item.key">
        <a-sub-menu v-if="item.children?.length" :key="item.key">
          <template #icon>
            <component :is="item.icon" />
          </template>
          <template #title>
            <span>{{ item.meta?.title || item.name }}</span>
          </template>
          <a-menu-item v-for="child in item.children" :key="child.key">
            <span>{{ child.meta?.title || child.name }}</span>
          </a-menu-item>
        </a-sub-menu>

        <a-menu-item v-else :key="item.key">
          <template #icon>
            <component :is="item.icon" />
          </template>
          <span>{{ item.meta?.title || item.name }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>
