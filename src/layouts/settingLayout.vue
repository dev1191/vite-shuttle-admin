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

const { useRenderIcon } = useRender()

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
  {
    name: t('settings.paymentGateway'),
    key: 'paymentGateway',
    icon: useRenderIcon('hugeicons:payment-01', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/payment-gateways`,
    namePath: [t('menu.settings.title'), t('menu.settings.paymentGateway')],
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
  <div class="px-1">
    <Heading title="Settings" description="Manage your profile and account settings" />

    <div class="flex flex-col gap-3 space-y-4 md:space-y-0 lg:flex-row lg:space-y-0 lg:space-x-12">
      <a-layout-sider width="255">
        <a-menu
          mode="inline"
          :selectedKeys="selectedKeys"
          :openKeys="openKeys"
          style="height: 100%"
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

      <div class="w-full">
        <section class="w-full space-y-2 space-x-2">
          <a-card>
            <slot />
          </a-card>
        </section>
      </div>
    </div>
  </div>
</template>
