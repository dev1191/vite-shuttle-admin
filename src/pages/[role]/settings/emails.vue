<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSiteSettings } from '@/composables/modules/useSiteSettings'
import SettingLayout from '@/layouts/settingLayout.vue'
import { message } from 'ant-design-vue'

const { t } = useI18n()
const { fetchSetting, item, isLoading, editSetting } = useSiteSettings()

onMounted(() => {
  fetchSetting('smtp')
})

const handleEditSetting = async (formData: Record<string, any>) => {
  try {
    await editSetting('smtp', formData)
    message.success(
      t('common.updateMessage', {
        title: t('menu.settings.email.title'),
        name: 'email SMTP',
      }),
    )
  } catch (error) {
    console.error('❌ Failed to update SMTP settings:', error)
  }
}
</script>

<template>
  <SettingLayout :title="t('settings.email')">
    <EmailForm :item="item" :isLoading="isLoading" @submit="handleEditSetting" />
  </SettingLayout>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: settings.email
  icon: SettingOutlined
  order: 10
  drawerIndex: 10
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - settings.title
    - settings.email
</route>

<style scoped></style>
