<script setup lang="ts">
import { useSiteSettings } from '@/composables/modules/useSiteSettings'
import SettingLayout from '@/layouts/settingLayout.vue'
import { message } from 'ant-design-vue'

const { t } = useI18n()
const { fetchSetting, item, isLoading, editSetting } = useSiteSettings()

onMounted(() => {
  fetchSetting('app')
})

const handleEditSetting = async (formData: Record<string, any>) => {
  try {
    await editSetting('app', formData)
    message.success(
      t('common.updateMessage', {
        title: t('menu.settings.app.title'),
        name: 'app',
      }),
    )
  } catch (error) {
    console.error('❌ Failed to update SMTP settings:', error)
  }
}
</script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: settings.app.title
  icon: SettingOutlined
  order: 10
  drawerIndex: 10
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - settings.title
    - settings.app.title
</route>

<template>
  <SettingLayout :title="t('settings.app.title')">
    <AppForm :item="item" :isLoading="isLoading" @submit="handleEditSetting" />
  </SettingLayout>
</template>

<style scoped></style>
