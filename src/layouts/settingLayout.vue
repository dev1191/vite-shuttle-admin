<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.store'
import type { IMenuItem } from '@/types/menu'
interface Props {
  title: string
  description?: string
}

defineProps<Props>()

const { user } = useUserStore()
const { t } = useI18n()
const currentRole = computed(() => user?.role.toLocaleLowerCase() || 'admin')
const selectedKeys = ref<string[]>(['dashboard'])
const openKeys = ref<string[]>(['dashboard'])

const sidebarNavItems: IMenuItem[] = [
  {
    name: 'General Settings',
    key: 'general',
    icon: useRenderIcon('hugeicons:settings-05', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/general`,
  },
  {
    name: 'Countries',
    key: 'countries',
    icon: useRenderIcon('hugeicons:global', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/countries`,
    namePath: [t('menu.settings.title'), t('menu.settings.countries')],
  },
  {
    name: t('settings.currencies'),
    key: 'currencies',
    icon: useRenderIcon('hugeicons:money-01', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/currencies`,
    namePath: [t('menu.settings.title'), t('menu.settings.currencies')],
  },
  {
    name: t('settings.languages'),
    key: 'languages',
    icon: useRenderIcon('hugeicons:language-square', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/languages`,
    namePath: [t('menu.settings.title'), t('menu.settings.languages')],
  },
]

const currentRoute = useRoute()
const router = useRouter()

const flashTimer = ref<number | null>(null)
const flashMenu = (key: string) => {
  openKeys.value = [key]
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
    const findMenuKey = (items: IMenuItem[], path: string): string | undefined => {
      for (const item of items) {
        if (item.path === path) return item.key
      }
      return undefined
    }

    const key = findMenuKey(sidebarNavItems, path)
    if (key) {
      selectedKeys.value = [key]
    }
  },
  { immediate: true },
)

const handleMenuClick = (key: string) => {
  const findPath = (items: IMenuItem[]): string | undefined => {
    for (const item of items) {
      if (item.key.toLowerCase() === key.toLowerCase()) return item.path
    }
    return undefined
  }

  const path = findPath(sidebarNavItems)
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="px-1 py-1">
    <Heading title="Settings" description="Manage your profile and account settings" />

    <div class="flex flex-col gap-4 space-y-8 md:space-y-0 lg:flex-row lg:space-y-0 lg:space-x-12">
      <a-layout-sider width="270" height="600">
        <a-menu
          mode="inline"
          :selectedKeys="selectedKeys"
          :openKeys="openKeys"
          style="height: 100%; border-right: 0"
          @select="({ key }) => handleMenuClick(key as string)"
        >
          <a-menu-item v-for="item in sidebarNavItems" :key="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <span> {{ item.name }}</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-divider class="my-6 md:hidden" />

      <div class="flex-1 md:max-w-2xl">
        <section class="max-w-xl space-y-12 space-x-4">
          <a-card>
            <div class="flex flex-col space-y-1">
              <HeadingSmall :title="title" :description="description" />
            </div>

            <slot />
          </a-card>
        </section>
      </div>
    </div>
  </div>
</template>
