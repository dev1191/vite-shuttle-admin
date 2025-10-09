<script setup lang="ts">
import type { Customer } from '@/types/customers'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useCustomers } from '@/composables/modules/useCustomers'
import { generateReferralCode } from '@/utils'

const { t } = useI18n()
const drawerRef = ref()
const drawerVisible = ref(false)
const isEdit = ref(false)
const loading = ref(false)

const { addCustomer, editCustomer, fetchCustomers } = useCustomers()

const formData = reactive({
  firstname: '',
  lastname: '',
  email: '',
  refercode: '',
  gender: 'Male',
  country_code: '91',
  phone: '',
  status: true,
})

const rules: Record<string, Rule[]> = {
  firstname: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.manageCustomers.form.firstname'),
      }),
      trigger: 'blur',
    },
  ],
  lastname: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.manageCustomers.form.lastname'),
      }),
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.manageCustomers.form.phone') }),
      trigger: 'blur',
    },
    { pattern: /^\d{9,11}$/, message: t('validation.phoneFormat'), trigger: 'blur' },
  ],
  email: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.manageCustomers.form.email') }),
      trigger: 'blur',
    },
  ],
}

function openDrawer(edit = false, record?: Customer) {
  isEdit.value = edit
  drawerVisible.value = true
  if (edit && record) Object.assign(formData, record)
}

function handleClose() {
  drawerVisible.value = false
  Object.assign(formData, {
    ids: '',
    firstname: '',
    lastname: '',
    gender: 'Male',
    refercode: '',
    email: '',
    country_code: '91',
    phone: '',
    status: true,
  })
}

async function handleSubmit(formData: Customer) {
  try {
    loading.value = true

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (isEdit.value) {
      // Edit existing customer
      await editCustomer(formData.ids, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        country_code: formData.country_code,
        phone: formData.phone,
        status: formData.status,
      })
    } else {
      // Add new customer
      formData.refercode = generateReferralCode(6) // generate referral code
      await addCustomer(formData)
    }

    message.success(
      isEdit.value
        ? t('common.updateMessage', { name: formData.firstname })
        : t('common.createMessage', { name: formData.firstname }),
    )
    fetchCustomers()
    handleClose()
  } finally {
    loading.value = false
  }
}

defineExpose({
  openDrawer,
})
</script>

<template>
  <BaseDrawerForm
    ref="drawerRef"
    :visible="drawerVisible"
    :title="isEdit ? 'Edit Customer' : 'Create Customer'"
    :formData="formData"
    :loading="loading"
    :isEdit="isEdit"
    :rules="rules"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #fields="{ form }">
      <a-form-item :label="t('menu.manageCustomers.form.firstname')" name="firstname">
        <a-input
          size="large"
          v-model:value="form.firstname"
          :placeholder="
            t('validation.placeholder', { name: t('menu.manageCustomers.form.firstname') })
          "
        />
      </a-form-item>
      <a-form-item :label="t('menu.manageCustomers.form.lastname')" name="lastname">
        <a-input
          size="large"
          v-model:value="form.lastname"
          :placeholder="
            t('validation.placeholder', { name: t('menu.manageCustomers.form.lastname') })
          "
        />
      </a-form-item>

      <a-form-item :label="t('menu.manageCustomers.form.email')" name="email">
        <a-input
          size="large"
          v-model:value="form.email"
          :placeholder="t('validation.placeholder', { name: t('menu.manageCustomers.form.email') })"
        />
      </a-form-item>

      <PhoneNumberInput
        v-model="formData.phone"
        v-model:countryCode="formData.country_code"
        name="phone"
        label="Phone Number"
        :rules="rules.phone"
        :placeHolderPhone="
          t('validation.placeholder', { name: t('menu.manageCustomers.form.phone') })
        "
      />
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('menu.manageCustomers.form.gender')" name="gender">
            <a-radio-group v-model:value="formData.gender">
              <a-radio-button value="Male">{{ t('common.male') }}</a-radio-button>
              <a-radio-button value="Female">{{ t('common.female') }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('common.status')" name="status">
            <a-radio-group v-model:value="formData.status">
              <a-radio-button :value="true">{{ t('common.active') }}</a-radio-button>
              <a-radio-button :value="false">{{ t('common.inactive') }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </template>
  </BaseDrawerForm>
</template>

<style scoped></style>
