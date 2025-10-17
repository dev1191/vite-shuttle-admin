<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.store'
import type { IMenuItem } from '@/types/menu'

const props = defineProps<{ title: string; description?: string }>()
const { user } = useUserStore()
const { t } = useI18n()
const { useRenderIcon } = useRender()
const router = useRouter()
const route = useRoute()

const currentRole = computed(() => user?.role?.toLowerCase() || 'admin')
const selectedKeys = ref<string[]>(['general'])
const openKeys = ref<string[]>(['general'])
const loading = ref(true)

// Sidebar items
const sidebarNavItems = computed<IMenuItem[]>(() => [
  {
    name: t('menu.settings.general.title'),
    key: 'general',
    icon: useRenderIcon('hugeicons:settings-05', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/general`,
  },
  {
    name: t('menu.settings.app.title'),
    key: 'app',
    icon: useRenderIcon('hugeicons:apple-reminder', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/app`,
  },
  {
    name: t('menu.settings.notifications.title'),
    key: 'notification',
    icon: useRenderIcon('hugeicons:notification-01', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/notifications`,
  },
  {
    name: t('menu.settings.emails.title'),
    key: 'email',
    icon: useRenderIcon('hugeicons:mail-setting-01', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/emails`,
  },
  {
    name: t('menu.settings.storage.title'),
    key: 'storage',
    icon: useRenderIcon('hugeicons:ai-cloud-02', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/storage`,
  },
  {
    name: t('menu.settings.countries.title'),
    key: 'countries',
    icon: useRenderIcon('hugeicons:global', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/countries`,
  },
  {
    name: t('menu.settings.currencies.title'),
    key: 'currencies',
    icon: useRenderIcon('hugeicons:money-01', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/currencies`,
  },
  {
    name: t('menu.settings.languages.title'),
    key: 'languages',
    icon: useRenderIcon('hugeicons:language-square', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/languages`,
  },
  {
    name: t('menu.settings.paymentGateway.title'),
    key: 'paymentGateway',
    icon: useRenderIcon('hugeicons:payment-01', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/payment-gateways`,
  },
  {
    name: t('menu.settings.terms.title'),
    key: 'terms',
    icon: useRenderIcon('hugeicons:book-open-01', { style: { fontSize: '24px' } }),
    path: `/${currentRole.value}/settings/term-and-conditions`,
  },
])

// Simulate loading
onMounted(() => {
  setTimeout(() => (loading.value = false), 1000)
})

// Update menu selection when route changes
watchEffect(() => {
  const activeItem = sidebarNavItems.value.find((i) => i.path === route.path)
  if (activeItem) {
    selectedKeys.value = [activeItem.key]
    openKeys.value = [activeItem.key]
  }
})

// Handle menu click
const handleMenuClick = (key: string) => {
  const item = sidebarNavItems.value.find((i) => i.key === key)
  if (item) router.push(item.path)
}
</script>

<template>
  <div class="px-1">
    <Heading
      :title="t('menu.settings.title')"
      :description="props.description || t('menu.settings.account')"
    />

    <div class="flex flex-col gap-3 lg:flex-row lg:space-x-12">
      <a-layout-sider width="255" style="min-height: 100vh; background: #fff">
        <template v-if="loading">
          <div class="p-10 flex flex-col justify-center space-y-3">
            <a-skeleton
              v-for="n in 10"
              :key="n"
              active
              :avatar="{ shape: 'square', size: 28 }"
              title
              :paragraph="false"
            />
          </div>
        </template>

        <a-menu
          v-else
          mode="inline"
          :selectedKeys="selectedKeys"
          :openKeys="openKeys"
          @select="({ key }) => handleMenuClick(key as string)"
          style="height: 100%"
        >
          <a-menu-item v-for="item in sidebarNavItems" :key="item.key">
            <template #icon><component :is="item.icon" /></template>
            <span>{{ item.name }}</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <div class="w-full">
        <a-card>
          <slot />
        </a-card>
      </div>
    </div>
  </div>
</template>
