<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { RightOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useOperators } from '@/composables/modules/useOperators'
import { useUserStore } from '@/stores/modules/user.store'

const { t } = useI18n()
const props = defineProps({
  modelValue: { type: Object, required: true },
  isEdit: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'next'])
const { checkOperatorExists } = useOperators()
const formRef = ref<FormInstance>()
const isEditable = computed(() => props.isEdit)
const setPassword = ref(isEditable.value)
const { user } = useUserStore()
const router = useRouter()

const rules: Record<string, Rule[]> = {
  fullname: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.manageOperators.form.fullname') }),
      trigger: 'blur',
    },
    {
      min: 2,
      max: 20,
      message: t('validation.lengthBetween', { min: 2, max: 20 }),
      trigger: 'blur',
    },
  ],
  phone: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.manageOperators.form.phone') }),
      trigger: 'blur',
    },
    { pattern: /^\d{9,11}$/, message: t('validation.phoneFormat'), trigger: 'blur' },
    {
      validator: async (_rule, value) => {
        if (!value) return Promise.resolve()
        const { exists } = await checkOperatorExists('', value, isEditable.value)
        if (exists) return Promise.reject(t('validation.phoneExists'))
        return Promise.resolve()
      },
      trigger: ['blur', 'change'],
    },
  ],
  email: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.manageOperators.form.email') }),
      trigger: 'blur',
    },
    {
      type: 'email',
      message: t('validation.invalid', { name: t('menu.manageOperators.form.email') }),
      trigger: ['blur', 'change'],
    },
    {
      validator: async (_rule, value) => {
        if (!value) return Promise.resolve()
        const { exists } = await checkOperatorExists(value, '', isEditable.value)
        if (exists) return Promise.reject(t('validation.emailExists'))
        return Promise.resolve()
      },
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      required: isEditable.value && setPassword.value,
      message: t('validation.required', { name: t('menu.manageOperators.form.password') }),
      trigger: 'blur',
    },
    {
      min: 6,
      max: 20,
      message: t('validation.lengthBetween', { min: 6, max: 20 }),
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      required: isEditable.value && setPassword.value,
      message: t('validation.required', { name: t('menu.manageOperators.form.confirmPassword') }),
      trigger: 'blur',
    },
    {
      validator: async (_rule: Rule, value: string) => {
        if ((!isEditable.value || setPassword.value) && value !== props.modelValue.password) {
          return Promise.reject(t('validation.passwordMismatch'))
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

const handleNext = async () => {
  await formRef.value?.validate()
  emit('next')
}
</script>

<template>
  <a-form ref="formRef" layout="vertical" :rules="rules" :model="modelValue">
    <a-row :gutter="24" class="">
      <a-col :span="12">
        <a-form-item :label="t('menu.manageOperators.form.fullname')" name="fullname">
          <a-input
            size="large"
            v-model:value="modelValue.fullname"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.fullname') })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('menu.manageOperators.form.email')" name="email">
          <a-input
            size="large"
            v-model:value="modelValue.email"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.email') })
            "
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <PhoneNumberInput
          v-model="modelValue.phone"
          :defaultCountry="modelValue.country_code"
          v-model:countryCode="modelValue.country_code"
          name="phone"
          :rules="rules.phone"
          :label="t('menu.manageOperators.form.phone')"
          :placeHolderPhone="
            t('validation.placeholder', { name: t('menu.manageOperators.form.phone') })
          "
        />
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('common.status')" name="status">
          <a-radio-group v-model:value="modelValue.is_active">
            <a-radio-button :value="true">{{ t('common.active') }}</a-radio-button>
            <a-radio-button :value="false">{{ t('common.inactive') }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="16">
        <a-form-item :label="t('menu.manageOperators.form.setPassword')" name="roles">
          <a-switch v-model:checked="setPassword" />
        </a-form-item>
      </a-col>
      <a-col :span="12" v-if="isEditable && setPassword">
        <a-form-item :label="t('menu.manageOperators.form.password')" name="password">
          <a-input-password
            v-model:value="modelValue.password"
            size="large"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.password') })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="12" v-if="isEditable && setPassword">
        <a-form-item :label="t('menu.manageOperators.form.confirmPassword')" name="confirmPassword">
          <a-input-password
            v-model:value="modelValue.confirmPassword"
            size="large"
            :placeholder="
              t('validation.placeholder', { name: t('menu.manageOperators.form.confirmPassword') })
            "
          />
        </a-form-item>
      </a-col>
    </a-row>

    <div class="flex gap-2 justify-end">
      <a-button size="large" @click="() => router.push(`/${user?.role}/manage-operators`)">
        {{ t('common.back') }}
      </a-button>
      <a-button size="large" type="primary" @click="handleNext">
        {{ t('common.next') }}
        <template #icon>
          <RightOutlined />
        </template>
      </a-button>
    </div>
  </a-form>
</template>
