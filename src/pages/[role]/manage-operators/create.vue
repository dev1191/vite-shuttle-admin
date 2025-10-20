<script setup lang="ts">
import { useOperators } from '@/composables/modules/useOperators'
import { message } from 'ant-design-vue'

const { t } = useI18n()
const current = ref<number>(0)
const isEdit = ref<boolean>(false)
const { addOperator, isLoading } = useOperators()

const formData = ref({
  ids: '',
  picture: '',
  fullname: 'asdasd',
  email: 'asdasd@gmail.com',
  password: '123456',
  confirmPassword: '123456',
  country_code: '91',
  phone: '88788888888',
  status: true,
  company: 'Operator pvt. ltd.',
  business_email: 'business@operator.com',
  business_contactno: '23445345345',
  address_1: '23423423432',
  city: '',
  pincode: '12333',
  registration_certificate: [],
  gst_certificate: [],
  pan_card: [],
  transport_permit: [],
  commission_type: 'percentage',
  commission: 0,
})

const stepStyle = {
  marginBottom: '60px',
  boxShadow: '0px -1px 0 0 #e8e8e8 inset',
}

const next = () => {
  if (current.value < 2) current.value++
}
const prev = () => {
  if (current.value > 0) current.value--
}

const handleSubmit = async () => {
  try {
    const result = await addOperator(formData.value)
    message.success(
      t('common.createMessage', {
        title: t('menu.manageOperators.Operator'),
        name: formData.value.firstname,
      }),
    )
  } catch (error) {
    console.error('Failed to create Operator:', error)
    message.error(t('common.errorMessage'))
  }
}
</script>

<template>
  <a-card :title="t('menu.manageOperators.newOperator')">
    <a-steps :current="current" type="navigation" :style="stepStyle">
      <a-step :title="t('menu.manageOperators.basicDetails')" />
      <a-step :title="t('menu.manageOperators.companyDetails')" />
      <a-step :title="t('menu.manageOperators.operatorDocuments')" />
    </a-steps>

    <div class="mt-6">
      <OperatorBasicDetailsForm
        v-if="current === 0"
        v-model:modelValue="formData"
        :isEdit="isEdit"
        @next="next"
      />
      <OperatorCompanyForm
        v-else-if="current === 1"
        v-model:modelValue="formData"
        @prev="prev"
        @next="next"
      />
      <OperatorDocumentsForm
        v-else
        v-model:modelValue="formData"
        @prev="prev"
        @submit="handleSubmit"
      />
    </div>
  </a-card>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageOperators.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - manageOperators.title
    - manageOperators.createOperator
</route>

<style scoped></style>
