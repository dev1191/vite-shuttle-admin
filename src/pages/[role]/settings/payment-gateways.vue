<script setup lang="ts">
import SettingLayout from '@/layouts/settingLayout.vue'
import { useGateways } from '@/composables/modules/useGateways'
import type { Gateway } from '@/types'
import { message } from 'ant-design-vue'
const { t } = useI18n()

const { gateways, isLoading, editGateway } = useGateways()

const itemSelected = ref<Gateway | null>(null)
const editFormRef = ref()
const doShowEditGatewayModal = ref<boolean>(false)

const showEditGateway = (data: Gateway) => {
  itemSelected.value = data
  doShowEditGatewayModal.value = true
}

const onGatewaySaved = async (formData: any) => {
  isLoading.value = true
  try {
    await editGateway(formData.site, {
      is_enabled: formData.is_enabled,
      mode: formData.mode,
      currency: formData.currency,
      username: formData.username,
      password: formData.password,
      key: formData.key,
      secret: formData.secret,
      integration_id: formData.integration_id,
      frame_id: formData.frame_id,
    })
    message.success(
      t('common.updateMessage', {
        title: t('menu.settings.paymentGateway.title'),
        name: formData.site,
      }),
    )
    isLoading.value = false
    doShowEditGatewayModal.value = false
  } catch (error: any) {
    console.error('Submit failed:', error)
    message.error(error.message || t('common.submitFailed'))
    isLoading.value = false
  }
}
</script>

<template>
  <SettingLayout :title="t('menu.settings.paymentGateway.title')">
    <GatewayIndex :gateways="gateways" :loading="isLoading" @editGateway="showEditGateway" />

    <GatewayForm
      ref="editFormRef"
      :isEdit="itemSelected !== null"
      :gateway="itemSelected"
      :visible="doShowEditGatewayModal"
      @close="doShowEditGatewayModal = false"
      @submit="onGatewaySaved"
    />
  </SettingLayout>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: settings.paymentGateway.title
  icon: SettingOutlined
  order: 10
  drawerIndex: 10
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - settings.title
    - settings.paymentGateway.title
</route>

<style scoped></style>
