<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { RightOutlined } from '@ant-design/icons-vue'

const { t } = useI18n()
const props = defineProps({
  modelValue: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue', 'next'])
const formRef = ref<FormInstance>()

const handleNext = async () => {
  await formRef.value?.validate()
  emit('next')
}
</script>

<template>
  <a-form ref="formRef" layout="vertical" :model="modelValue">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          :label="t('menu.manageDrivers.form.firstname')"
          name="firstname"
          :rules="[{ required: true }]"
        >
          <a-input
            size="large"
            v-model:value="modelValue.firstname"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageDrivers.form.firstname') })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :label="t('menu.manageDrivers.form.lastname')"
          name="lastname"
          :rules="[{ required: true }]"
        >
          <a-input
            size="large"
            v-model:value="modelValue.lastname"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageDrivers.form.lastname') })
            "
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          :label="t('menu.manageDrivers.form.email')"
          name="email"
          :rules="[{ required: true }]"
        >
          <a-input
            size="large"
            v-model:value="modelValue.email"
            :placeholder="t('validation.placeholder', { name: t('menu.manageDrivers.form.email') })"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <PhoneNumberInput
          v-model="modelValue.phone"
          v-model:countryCode="modelValue.country_code"
          name="phone"
          label="Phone Number"
          :rules="[{ required: true }]"
          :placeHolderPhone="
            t('validation.placeholder', { name: t('menu.manageDrivers.form.phone') })
          "
        />
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          :label="t('menu.manageDrivers.form.nationalId')"
          :rules="[{ required: true }]"
          name="national_id"
        >
          <a-input
            size="large"
            v-model:value="modelValue.national_id"
            :placeHolderPhone="
              t('validation.placeholder', { name: t('menu.manageDrivers.form.nationalId') })
            "
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item :label="t('menu.manageDrivers.form.type')" name="gender">
          <a-radio-group v-model:value="modelValue.type">
            <a-radio-button value="driver">{{ t('menu.manageDrivers.driver') }}</a-radio-button>
            <a-radio-button value="assistant">{{
              t('menu.manageDrivers.assistant')
            }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('common.status')" name="status">
          <a-radio-group v-model:value="modelValue.status">
            <a-radio-button :value="true">{{ t('common.active') }}</a-radio-button>
            <a-radio-button :value="false">{{ t('common.inactive') }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>

    <div class="flex justify-end">
      <a-button size="large" type="primary" @click="handleNext">
        {{ t('common.next') }}
        <template #icon>
          <RightOutlined />
        </template>
      </a-button>
    </div>
  </a-form>
</template>
