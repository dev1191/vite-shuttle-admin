<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.store'
import type { User } from '@/types/users'
import { message, type FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { SelectProps } from 'ant-design-vue/es/vc-select'
import { useI18n } from 'vue-i18n'

interface Props {
  visible: boolean
  type: string
  userData?: User
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { roles } = useUserStore()
const isLoading = ref<boolean>(false)
const roleOptions = ref<SelectProps['options']>([...roles])

// ✅ Correct way to use i18n
const { t } = useI18n()
const formRef = ref()

const formData = reactive({
  fullname: '',
  email: '',
  phone: '',
  country_code: '',
  password: '',
  confirmPassword: '',
  role: '',
  is_active: true,
})

const rules: Record<string, Rule[]> = {
  fullname: [
    {
      required: true,
      message: t('validation.required', { name: t('manageUsers.users.form.fullname') }),
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
      message: t('validation.required', { name: t('manageUsers.users.form.phone') }),
      trigger: 'blur',
    },
    { pattern: /^1[3-9]\d{9}$/, message: t('validation.phoneFormat'), trigger: 'blur' },
  ],
  email: [
    {
      required: true,
      message: t('validation.required', { name: t('manageUsers.users.form.email') }),
      trigger: 'blur',
    },
  ],
  role: [
    {
      required: true,
      message: t('validation.required', { name: t('manageUsers.users.form.roles') }),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('validation.required', { name: t('manageUsers.users.form.password') }),
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
      required: true,
      message: t('validation.required', { name: t('manageUsers.users.form.confirmPassword') }),
      trigger: 'blur',
    },
    {
      validator: async (_rule: Rule, value: string) => {
        if (value !== formData.password) {
          return Promise.reject(t('validation.passwordMismatch'))
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const title = computed(() =>
  props.type === 'add'
    ? t('common.create', { name: t('manageUsers.users.newUser') })
    : t('common.edit'),
)

const initFormData = () => {
  const isEdit = props.type === 'edit' && props.userData
  const row = props.userData

  Object.assign(formData, {
    fullname: isEdit ? row.fullname || '' : '',
    email: isEdit ? row.email || '' : '',
    phone: isEdit ? row.phone || '' : '',
    role: isEdit ? row.role || '' : '',
    is_active: isEdit ? row.is_active || false : false,
  })
}

watch(
  () => [props.visible, props.type, props.userData],
  ([visible]) => {
    if (visible) {
      initFormData()
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log('values', formState, toRaw(formState))
    })
    .catch((error) => {
      console.log('error', error)
      message.error('errpr', error)
    })
  // if (!formRef.value) return

  // await formRef.value.validate((valid: any) => {
  //   if (valid) {
  //     message.success(props.type === 'add' ? '添加成功' : '更新成功')
  //     dialogVisible.value = false
  //     emit('submit')
  //   }
  //   message.success('errpr')
  // })
}
</script>

<template>
  <a-modal v-model:open="dialogVisible" :title="title" width="40%" centered>
    <!-- your form goes here -->
    <AForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      :labelCol="{ span: 12 }"
    >
      <a-row :gutter="16">
        <!-- Fullname -->
        <a-col :span="12">
          <a-form-item :label="t('manageUsers.users.form.fullname')" name="fullname">
            <a-input
              v-model:value="formData.fullname"
              size="large"
              :placeholder="
                t('validation.placeholder', { name: t('manageUsers.users.form.fullname') })
              "
            />
          </a-form-item>
        </a-col>

        <!-- Email -->
        <a-col :span="12">
          <a-form-item :label="t('manageUsers.users.form.email')" name="email">
            <a-input
              v-model:value="formData.email"
              size="large"
              type="email"
              :placeholder="
                t('validation.placeholder', { name: t('manageUsers.users.form.email') })
              "
            >
              <template #prefix>
                <Icon name="hugeicons:mail-01" :size="5" />
              </template>
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <PhoneNumberInput
            v-model="formData.phone"
            v-model:countryCode="formData.country_code"
            name="phone"
            label="Phone Number"
            :rules="rules.phone"
            :placeHolderPhone="
              t('validation.placeholder', { name: t('manageUsers.users.form.phone') })
            "
          />
        </a-col>

        <a-col :span="12">
          <a-form-item :label="t('manageUsers.users.form.roles')" name="email">
            <a-select
              size="large"
              :placeholder="t('common.select', { name: t('manageUsers.users.form.roles') })"
              v-model:value="formData.role"
              :options="roleOptions"
            ></a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('manageUsers.users.form.password')" name="password">
            <a-input-password
              v-model:value="formData.password"
              size="large"
              :placeholder="
                t('validation.placeholder', { name: t('manageUsers.users.form.password') })
              "
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('manageUsers.users.form.confirmPassword')" name="confirmPassword">
            <a-input-password
              v-model:value="formData.confirmPassword"
              size="large"
              :placeholder="
                t('validation.placeholder', { name: t('manageUsers.users.form.confirmPassword') })
              "
            />
          </a-form-item>
        </a-col>
      </a-row>
    </AForm>
    <template #footer>
      <div class="dialog-footer">
        <AButton size="large" @click="dialogVisible = false">{{ t('common.cancel') }}</AButton>
        <AButton size="large" type="primary" @click="handleSubmit">{{
          t('common.create', { name: t('manageUsers.users.user') })
        }}</AButton>
      </div>
    </template>
  </a-modal>
</template>

<style scoped></style>
