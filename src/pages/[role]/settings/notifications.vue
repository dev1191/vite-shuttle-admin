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
        title: t('menu.settings.storage.title'),
        name: 'storage SMTP',
      }),
    )
  } catch (error) {
    console.error('❌ Failed to update SMTP settings:', error)
  }
}
</script>

<template>
  <SettingLayout :title="t('settings.storage')">
    <NotificationForm :item="item" :isLoading="isLoading" @submit="handleEditSetting" />
  </SettingLayout>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: settings.notification
  icon: SettingOutlined
  order: 10
  drawerIndex: 10
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - settings.title
    - settings.notification
</route>

<style scoped></style>
