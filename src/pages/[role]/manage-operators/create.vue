<script setup lang="ts">
import { useOperators } from '@/composables/modules/useOperators'
import { message, type UploadFile } from 'ant-design-vue'

const { t } = useI18n()
const current = ref<number>(0)
const isEdit = ref<boolean>(true)
const { addOperator, isLoading } = useOperators()

const formData = ref({
  id: '',
  firstname: '',
  lastname: '',
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
  country_code: '91',
  phone: '',
  is_active: true,
  picture: '',
  business_name: '',
  business_email: '',
  business_contactno: '',
  address_1: '',
  city: '',
  pincode: '',
  commission_type: 'percentage',
  commission: 10,
  registration_certificate: null,
  gst_certificate: null,
  tax_document: null,
  transport_permit: null,
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

const handleFileObject = (file: any) => {
  return file ? (file.originFileObj as File) : null
}
const handleSubmit = async () => {
  try {
    const result = await addOperator({
      ...formData.value,
      picture: formData.value.picture,
      registration_certificate: handleFileObject(formData.value.registration_certificate[0]),
      gst_certificate: handleFileObject(formData.value.gst_certificate[0]),
      tax_document: handleFileObject(formData.value.tax_document[0]),
      transport_permit: handleFileObject(formData.value.transport_permit[0]),
    })

    message.success(
      t('common.createMessage', {
        title: t('menu.manageOperators.Operator'),
        name: formData.value.fullname,
      }),
    )
  } catch (error) {
    console.error('Failed to create Operator:', error)
    message.error(t('common.errorMessage'))
  }
}
</script>

<template>
  <a-card :title="t('menu.manageOperators.newOperator')" :bordered="false">
    <a-steps :current="current" type="navigation" :style="stepStyle">
      <a-step :title="t('menu.manageOperators.basicDetails')" />
      <a-step :title="t('menu.manageOperators.companyDetails')" />
      <a-step :title="t('menu.manageOperators.operatorDocuments')" />
    </a-steps>

    <div class="mt-5">
      <OperatorBasicDetailsForm
        v-if="current === 0"
        v-model:modelValue="formData"
        :isEdit="isEdit"
        @next="next"
      />
      <OperatorCompanyForm
        v-else-if="current === 1"
        v-model:modelValue="formData"
        :isEdit="isEdit"
        @prev="prev"
        @next="next"
      />
      <OperatorDocumentsForm
        v-else
        v-model:modelValue="formData"
        :isEdit="isEdit"
        @prev="prev"
        @submit="handleSubmit"
        :isLoading="isLoading"
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
