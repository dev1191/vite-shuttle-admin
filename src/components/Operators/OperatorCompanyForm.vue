<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import {
  DollarOutlined,
  PercentageOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'

const { t } = useI18n()
const props = defineProps({
  modelValue: { type: Object, required: true },
  isEdit: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'next', 'prev'])
const formRef = ref<FormInstance>()
const setPassword = ref(false)

const rules: Record<string, Rule[]> = {
  company: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.manageOperators.form.company') }),
      trigger: 'blur',
    },
    {
      min: 2,
      max: 20,
      message: t('validation.lengthBetween', { min: 2, max: 20 }),
      trigger: 'blur',
    },
  ],
  business_email: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.manageOperators.form.businessEmail') }),
      trigger: 'blur',
    },
    {
      type: 'email',
      message: t('validation.invalid', { name: t('menu.manageOperators.form.businessEmail') }),
      trigger: ['blur', 'change'],
    },
  ],
}

const handlePrev = () => emit('prev')
const handleNext = async () => {
  await formRef.value?.validate()
  emit('next')
}
</script>

<template>
  <a-form ref="formRef" layout="vertical" :rules="rules" :model="modelValue">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item :label="t('menu.manageOperators.form.companyLogo')" name="avatar">
          <AvatarUpload v-model="modelValue.picture" :size="80" shape="square" :maxSizeMB="3" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item :label="t('menu.manageOperators.form.company')" name="company">
          <a-input
            size="large"
            v-model:value="modelValue.company"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.company') })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label="t('menu.manageOperators.form.businessEmail')" name="business_email">
          <a-input
            size="large"
            v-model:value="modelValue.business_email"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.businessEmail') })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label="t('menu.manageOperators.form.businessContactNo')" name="email">
          <a-input
            size="large"
            v-model:value="modelValue.business_contactno"
            :placeholder="
              t('validation.placeholder', {
                name: t('menu.manageOperators.form.businessContactNo'),
              })
            "
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item :label="t('menu.manageOperators.form.address1')" name="address_1">
          <a-textarea
            size="large"
            v-model:value="modelValue.address_1"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.address1') })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label="t('menu.manageOperators.form.city')" name="city">
          <a-input
            size="large"
            v-model:value="modelValue.city"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.city') })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label="t('menu.manageOperators.form.pincode')" name="pincode">
          <a-input
            size="large"
            v-model:value="modelValue.pincode"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.pincode') })
            "
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item :label="t('menu.manageOperators.form.commissionType')" name="commission_type">
          <a-radio-group size="large" v-model:value="modelValue.commission_type">
            <a-radio-button :value="'percentage'">{{ t('common.percentage') }}</a-radio-button>
            <a-radio-button :value="'fixed'">{{ t('common.fixed') }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item name="commission">
          <template #label>
            {{
              t('menu.manageOperators.form.commission', {
                name: modelValue.commission_type === 'percentage' ? '(%)' : '',
              })
            }}
            <a-tooltip>
              <template #title>
                Fare: $100 <br />
                Platform Commission (15%): $15 <br />Operator Share: $85
              </template>
              <a-button type="text">
                <template #icon>
                  <QuestionCircleOutlined />
                </template>
              </a-button>
            </a-tooltip>
          </template>

          <a-input-number
            :min="0"
            size="large"
            max="100"
            style="width: 100%"
            v-model:value="modelValue.commission"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.commission') })
            "
          >
            <template #addonAfter>
              <PercentageOutlined v-if="modelValue.commission_type === 'percentage'" />
              <DollarOutlined v-if="modelValue.commission_type === 'fixed'" />
            </template>
          </a-input-number>
        </a-form-item>
      </a-col>
    </a-row>
    <div class="flex justify-between mt-4">
      <a-button size="large" @click="handlePrev">{{ t('common.previous') }}</a-button>
      <a-button size="large" type="primary" @click="handleNext">
        {{ t('common.next') }}
        <template #icon>
          <RightOutlined />
        </template>
      </a-button>
    </div>
  </a-form>
</template>

<style scoped></style>
