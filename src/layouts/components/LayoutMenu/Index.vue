<script setup lang="ts">
import { useSidebarMenu } from '@/composables/useSidebarMenu'
import type { IMenuItem } from '@/types/menu'
import { getRoleMenu } from '@/utils/router'
//import SubMenuItem from './SubMenuItem.vue'

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

const selectedKeys = ref<string[]>(['dashboard'])
const openKeys = ref<string[]>(['dashboard'])

const { defaultMenus } = useSidebarMenu(props.userRole)

const menuItems = ref([...defaultMenus])

const flashTimer = ref<number | null>(null)
const flashMenu = (key: string) => {
  openKeys.value = [key]
  if (!props.collapsed) {
    return
  }
  if (flashTimer.value) {
    window.clearTimeout(flashTimer.value)
  }
  flashTimer.value = window.setTimeout(() => {
    openKeys.value = []
  }, 800)
}

watch(
  () => currentRoute.path,
  (path) => {
    console.log('currentRoute.path', currentRoute.path)
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
    if (key) {
      selectedKeys.value = [key]
    }
  },
  { immediate: true },
)

const handleMenuClick = (key: string) => {
  console.log('key', key)
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
  console.log('path :', path)
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="mt-3">
    <a-menu
      :inline-collapsed="collapsed"
      mode="inline"
      :selectedKeys="selectedKeys"
      :openKeys="openKeys"
      @select="({ key }) => handleMenuClick(key as string)"
      style="height: 100%"
    >
      <template v-for="item in menuItems" :key="item.key">
        <!-- If route has children -->
        <a-sub-menu v-if="item.children?.length" :key="item.key">
          <template #icon>
            <component :is="item.icon" />
          </template>
          <template #title>
            <span>{{ item.meta?.title || item.name }}</span>
          </template>
          <a-menu-item v-for="child in item.children" :key="child.key">
            <span>
              {{ child.meta?.title || child.name }}
            </span>
          </a-menu-item>
        </a-sub-menu>

        <!-- Single route -->
        <template v-else>
          <a-menu-item :key="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <span>{{ item.meta?.title || item.name }}</span>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </div>
</template>

<style scoped></style>
