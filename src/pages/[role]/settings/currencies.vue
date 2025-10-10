<script setup lang="ts">
import SettingLayout from '@/layouts/settingLayout.vue'

const { t } = useI18n()
</script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: settings.currencies
  icon: SettingOutlined
  order: 10
  drawerIndex: 10
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - settings.title
    - settings.currencies
</route>

<template>
  <SettingLayout :title="t('settings.currencies')">
    <CurrencyTable />
  </SettingLayout>
</template>

<style scoped></style>
