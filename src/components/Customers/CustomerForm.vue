<script setup lang="ts">
import type { Customer } from '@/types/customers'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

const { t } = useI18n()
const drawerVisible = ref(false)
const isEdit = ref(false)
const loading = ref(false)

const formData = reactive({
  firstname: '',
  lastname: '',
  email: '',
  country_code: '',
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
    firstname: '',
    lastname: '',
    email: '',
    country_code: '91',
    phone: '',
    status: true,
  })
}

async function handleSubmit(data: any) {
  loading.value = true
  try {
    await new Promise((r) => setTimeout(r, 800)) // simulate API
    message.success(isEdit.value ? 'Updated successfully' : 'Created successfully')
    handleClose()
  } catch (error) {
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
        <a-input size="large" v-model:value="form.firstname" placeholder="Enter name" />
      </a-form-item>
      <a-form-item :label="t('menu.manageCustomers.form.lastname')" name="lastname">
        <a-input size="large" v-model:value="form.lastname" placeholder="Enter name" />
      </a-form-item>

      <a-form-item :label="t('menu.manageCustomers.form.email')" name="email">
        <a-input size="large" v-model:value="form.email" placeholder="Enter email" />
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

      <a-form-item label="Status">
        <a-switch
          v-model:checked="form.status"
          checked-children="Active"
          un-checked-children="Inactive"
        />
      </a-form-item>
    </template>
  </BaseDrawerForm>
</template>

<style scoped></style>
