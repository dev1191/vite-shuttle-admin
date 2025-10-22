<script setup lang="ts">
import { useOperators } from '@/composables/modules/useOperators'
import type { Operator } from '@/types/operators'
import { message } from 'ant-design-vue'

const { getOperator, editOperator, isLoading } = useOperators()

const { t } = useI18n()
const current = ref<number>(0)
const isEdit = ref<boolean>(false)
const route = useRoute()
const formData = ref<Operator>({
  id: '',
  firstname: '',
  lastname: '',
  role: '',
  ids: '',
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
  country_code: '91',
  phone: '',
  is_active: true,
  picture: '',
  company: '',
  business_email: '',
  business_contactno: '',
  address_1: '',
  city: '',
  pincode: '',
  commission_type: 'percentage',
  commission: 10,
  registration_certificate: [],
  gst_certificate: [],
  tax_document: [],
  transport_permit: [],
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
    const result = await editOperator(formData.value.id, {
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

onMounted(async () => {
  const operatorId = route.params.id as string
  const operatorData = await getOperator(operatorId)
  formData.value = operatorData
  isEdit.value = true
})
</script>

<template>
  <a-card :title="t('menu.manageOperators.editOperator')" :bordered="false">
    <a-steps :current="current" type="navigation" :style="stepStyle">
      <a-step :title="t('menu.manageOperators.basicDetails')" />
      <a-step :title="t('menu.manageOperators.companyDetails')" />
      <a-step :title="t('menu.manageOperators.operatorDocuments')" />
    </a-steps>

    <div class="mt-2">
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
        :isLoading="isLoading"
      />
    </div>
  </a-card>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageOperators.editOperator
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - manageOperators.title
    - manageOperators.editOperator
</route>

<style scoped></style>
