<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarMenu } from '@/composables/useSidebarMenu'
import { Spin } from 'ant-design-vue'
import type { IMenuItem } from '@/types/menu'

const props = defineProps({
  collapsed: Boolean,
  userRole: {
    type: String,
    default: 'admin',
  },
})

const currentRoute = useRoute()
const router = useRouter()

const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])
const lastOpenKeys = ref<string[]>([])
const isNavigating = ref(false)
const menuItems = ref<IMenuItem[]>([])
const loading = ref(true)

const findMenuKeysByPath = (
  items: IMenuItem[],
  path: string,
): { selectedKey?: string; parentKey?: string } => {
  for (const item of items) {
    // Match exact path or path with trailing slash
    if (item.path === path || item.path + '/' === path) {
      return { selectedKey: item.key }
    }
    if (item.children?.length) {
      const result = findMenuKeysByPath(item.children, path)
      if (result.selectedKey) {
        return {
          selectedKey: result.selectedKey,
          parentKey: item.key,
        }
      }
    }
  }
  return {}
}

const initializeMenu = async () => {
  const { defaultMenus } = useSidebarMenu(props.userRole)
  menuItems.value = [...defaultMenus]

  await nextTick()
  const currentPath = currentRoute.path
  const { selectedKey, parentKey } = findMenuKeysByPath(menuItems.value, currentPath)

  if (selectedKey) {
    selectedKeys.value = [selectedKey]
    if (parentKey && !props.collapsed) {
      openKeys.value = [parentKey]
      lastOpenKeys.value = [parentKey]
    }
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await initializeMenu()
  } finally {
    loading.value = false
  }
})

watch(
  () => props.collapsed,
  (newCollapsed) => {
    if (newCollapsed) {
      lastOpenKeys.value = [...openKeys.value]
      openKeys.value = []
    } else {
      openKeys.value = lastOpenKeys.value
    }
  },
)

watch(
  () => currentRoute.path,
  async (path) => {
    if (isNavigating.value) return

    const { selectedKey, parentKey } = findMenuKeysByPath(menuItems.value, path)
    if (selectedKey) {
      selectedKeys.value = [selectedKey]
      if (parentKey && !props.collapsed) {
        openKeys.value = [parentKey]
      }
    }
  },
  { immediate: true },
)

const handleOpenChange = (keys: string[]) => {
  if (!props.collapsed) {
    openKeys.value = keys
    lastOpenKeys.value = keys
  }
}

const handleMenuClick = async (key: string) => {
  try {
    isNavigating.value = true

    const findMenuItem = (items: IMenuItem[], searchKey: string): IMenuItem | undefined => {
      for (const item of items) {
        if (item.key === searchKey) return item
        if (item.children?.length) {
          const found = findMenuItem(item.children, searchKey)
          if (found) return found
        }
      }
      return undefined
    }

    const menuItem = findMenuItem(menuItems.value, key)
    if (!menuItem?.path) return

    // Prevent unnecessary navigation
    if (currentRoute.path === menuItem.path) return

    selectedKeys.value = [key]
    await nextTick()

    await router.push({
      path: menuItem.path,
      replace: false,
    })
  } catch (error) {
    console.error('Navigation error:', error)
  } finally {
    isNavigating.value = false
  }
}
</script>

<template>
  <div class="mt-3 h-full relative">
    <Spin :spinning="loading" class="w-full h-full">
      <a-menu
        :inline-collapsed="collapsed"
        mode="inline"
        :selectedKeys="selectedKeys"
        :openKeys="openKeys"
        @select="({ key }) => handleMenuClick(key as string)"
        @openChange="handleOpenChange"
        class="h-full border-r-0"
      >
        <template v-for="item in menuItems" :key="item.key">
          <a-sub-menu v-if="item.children?.length" :key="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <template #title>
              <span>{{ item.meta?.title || item.name }}</span>
            </template>
            <a-menu-item v-for="child in item.children" :key="child.key" :disabled="child.disabled">
              <template #icon v-if="child.icon">
                <component :is="child.icon" />
              </template>
              <span>{{ child.meta?.title || child.name }}</span>
            </a-menu-item>
          </a-sub-menu>

          <a-menu-item v-else :key="item.key" :disabled="item.disabled">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <span>{{ item.meta?.title || item.name }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </Spin>
  </div>
</template>

<style scoped>
.ant-menu {
  transition: width 0.3s ease;
}
</style>
