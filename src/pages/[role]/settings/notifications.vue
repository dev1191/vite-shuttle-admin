<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSiteSettings } from '@/composables/modules/useSiteSettings'
import SettingLayout from '@/layouts/settingLayout.vue'
import { message } from 'ant-design-vue'

const { t } = useI18n()
const { fetchSetting, item, isLoading, editSetting } = useSiteSettings()

onMounted(() => {
  fetchSetting('notifications')
})

const handleEditSetting = async (formData: Record<string, any>) => {
  try {
    await editSetting('notifications', formData)
    message.success(
      t('common.updateMessage', {
        title: t('menu.settings.notifications.title'),
      }),
    )
  } catch (error) {
    console.error('❌ Failed to update notification settings:', error)
  }
}
</script>

<template>
  <SettingLayout
    :title="t('settings.notification.title')"
    :description="t('settings.notification.description')"
  >
    <NotificationForm :item="item" :isLoading="isLoading" @submit="handleEditSetting" />
  </SettingLayout>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: settings.notifications.title
  icon: SettingOutlined
  order: 10
  drawerIndex: 10
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - settings.title
    - settings.notifications.title
</route>

<style scoped></style>
