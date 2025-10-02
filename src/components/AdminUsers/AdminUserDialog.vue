<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.store'
import type { User } from '@/types/users'
import { message, type FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { SelectProps } from 'ant-design-vue/es/vc-select'
import { useI18n } from 'vue-i18n'

interface Props {
  visible: boolean
  isLoading: boolean
  type: string
  userData?: User
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', formData: User): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { roles } = useUserStore()
const roleOptions = ref<SelectProps['options']>([...roles])

// ✅ Correct way to use i18n
const { t } = useI18n()
const formRef = ref()

const formData = reactive<Partial<User> & { confirmPassword: string }>({
  ids: '',
  picture: '',
  firstname: '',
  lastname: '',
  fullname: '',
  email: '',
  phone: '',
  country_code: '91',
  password: '',
  confirmPassword: '',
  role: '',
  is_active: true,
})
const setPassword = ref<boolean>(false)

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
    { pattern: /^\d{9,11}$/, message: t('validation.phoneFormat'), trigger: 'blur' },
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
      required: props.type === 'add' || setPassword.value,
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
      required: props.type === 'add' || setPassword.value,
      message: t('validation.required', { name: t('manageUsers.users.form.confirmPassword') }),
      trigger: 'blur',
    },
    {
      validator: async (_rule: Rule, value: string) => {
        if ((props.type === 'add' || setPassword.value) && value !== formData.password) {
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
    ids: isEdit ? row?.ids || '' : '',
    picture: isEdit ? row?.picture || '' : '',
    fullname: isEdit ? row.fullname || '' : '',
    email: isEdit ? row.email || '' : '',
    phone: isEdit ? row.phone || '' : '',
    role: isEdit ? row.role || '' : '',
    is_active: isEdit ? row.is_active || false : false,
  })
}

watch(
  () => [props.visible, props.type, props.userData],
  ([visible, type]) => {
    if (visible) {
      initFormData()
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
    console.log('type', type)
    if (type == 'add') {
      setPassword.value = false
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      emit('submit', toRaw(formData))
    })
    .catch((error) => {
      console.log('error', error)
      message.error('errpr', error)
    })
}
</script>

<template>
  <a-modal v-model:open="dialogVisible" :title="title" width="40%" centered :maskClosable="false">
    <!-- your form goes here -->
    <AForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      :labelCol="{ span: 12 }"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('manageUsers.users.form.avatar')" name="avatar">
            <AvatarUpload v-model="formData.picture" :size="80" :maxSizeMB="3" />
          </a-form-item>
        </a-col>
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
          <a-form-item :label="t('manageUsers.users.form.roles')" name="roles">
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
        <a-col :span="16" v-if="props.type === 'edit'">
          <a-form-item :label="t('manageUsers.users.form.setPassword')" name="roles">
            <a-switch v-model:checked="setPassword" />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="props.type === 'add' || setPassword === true">
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
        <a-col :span="12" v-if="props.type === 'add' || setPassword === true">
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
        <a-col :span="12">
          <a-form-item :label="t('manageUsers.users.form.status')" name="status">
            <a-radio-group v-model:value="formData.is_active">
              <a-radio-button :value="true">{{ t('common.active') }}</a-radio-button>
              <a-radio-button :value="false">{{ t('common.inactive') }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </AForm>
    <template #footer>
      <div class="dialog-footer">
        <AButton size="large" @click="dialogVisible = false">{{ t('common.cancel') }}</AButton>
        <AButton size="large" type="primary" @click="handleSubmit" :loading="isLoading">{{
          type == 'add'
            ? t('common.create', { name: t('manageUsers.users.user') })
            : t('common.update', { name: t('manageUsers.users.user') })
        }}</AButton>
      </div>
    </template>
  </a-modal>
</template>

<style scoped></style>
