<script setup lang="ts">
import SettingLayout from '@/layouts/settingLayout.vue'
const { t } = useI18n()
</script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: settings.term
  icon: SettingOutlined
  order: 10
  drawerIndex: 10
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - settings.title
    - settings.term
</route>

<template>
  <SettingLayout :title="t('settings.term')"> </SettingLayout>
</template>

<style scoped></style>
