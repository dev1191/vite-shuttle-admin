<script setup lang="ts">
import { useSiteSettings } from '@/composables/modules/useSiteSettings'
import SettingLayout from '@/layouts/settingLayout.vue'
import { useUserStore } from '@/stores/modules/user.store'
import { message } from 'ant-design-vue'

const { t } = useI18n()
const { fetchSetting, item, isLoading, editSetting } = useSiteSettings()
const userStore = useUserStore()
onMounted(() => {
  fetchSetting('general')
})

const handleEditSetting = async (formData: Record<string, any>) => {
  try {
    const result = await editSetting('general', formData)
    await userStore.setGeneral({ ...userStore.generalSetting, ...result }) // update store settings
    message.success(
      t('common.updateMessage', {
        title: t('menu.settings.app.title'),
        name: 'app',
      }),
    )
  } catch (error) {
    console.error('❌ Failed to update general settings:', error)
  }
}
</script>

<template>
  <SettingLayout :title="t('settings.general')">
    <GeneralForm :item="item" :isLoading="isLoading" @submit="handleEditSetting" />
  </SettingLayout>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: settings.general.title
  icon: SettingOutlined
  order: 10
  drawerIndex: 10
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - settings.title
    - settings.general.title
</route>

<style scoped></style>
