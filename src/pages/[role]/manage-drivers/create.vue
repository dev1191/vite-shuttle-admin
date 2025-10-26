<script setup lang="ts">
import { useDrivers } from '@/composables/modules/useDrivers'
import { message } from 'ant-design-vue'

const { t } = useI18n()
const current = ref(0)

const { addDriver, isLoading } = useDrivers()
const formData = ref({
  ids: '',
  picture: '',
  firstname: '',
  lastname: '',
  national_id: '',
  type: 'driver',
  country_code: '91',
  phone: '',
  email: '',
  status: true,
  document_licence: null,
  document_national_icard: null,
  document_police_vertification: null,
})

const stepStyle = {
  marginBottom: '60px',
  boxShadow: '0px -1px 0 0 #e8e8e8 inset',
}

const next = () => {
  if (current.value < 1) current.value++
}

const prev = () => {
  if (current.value > 0) current.value--
}

const handleSubmit = async () => {
  console.log('Form Data:', formData.value)
  try {
    const result = await addDriver(formData.value)
    console.log('result Data:', result)
    message.success(
      t('common.createMessage', {
        title: t('menu.manageDrivers.driver'),
        name: formData.value.firstname,
      }),
    )
  } catch (error) {
    console.error('❌ Failed to create driver:', error)
  }
}
</script>

<template>
  <a-card title="Driver Registration">
    <a-steps :current="current" type="navigation" :style="stepStyle">
      <a-step title="Basic Details" />
      <a-step :title="t('menu.manageDrivers.driverDocuments')" />
    </a-steps>

    <div class="mt-6">
      <BasicDetailsForm v-if="current === 0" v-model="formData" @next="next" />
      <DocumentsForm v-else v-model="formData" @prev="prev" @submit="handleSubmit" />
    </div>
  </a-card>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageDrivers.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - manageDrivers.title
    - manageDrivers.createDriver
</route>

<style scoped></style>
