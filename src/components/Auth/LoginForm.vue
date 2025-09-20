<script setup lang="ts">
import { LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'

const { t } = useI18n()

const isLoading = ref(false)
const formRef = ref()
const formState = ref({
  email: '',
  password: '',
})

const rules: Record<string, Rule[]> = {
  email: [
    {
      max: 20,
      required: true,
      message: t('validation.required', { name: t('auth.login.email') }),
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    {
      max: 20,
      required: true,
      message: t('validation.required', { name: t('auth.login.password') }),
      trigger: ['blur', 'change'],
    },
  ],
}

const handleSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      message.loading('loading...', 0)

      isLoading.value = true
      console.log('values', formState, toRaw(formState))
    })
    .catch((error) => {
      console.log('error', error)
      message.error(t('auth.failed'))
      isLoading.value = false
    })
}
</script>

<template>
  <a-form
    ref="formRef"
    layout="vertical"
    :model="formState"
    :rules="rules"
    @submit.prevent="handleSubmit"
  >
    <!-- Email -->
    <a-form-item :label="t('auth.login.email')" name="email">
      <a-input
        size="large"
        v-model:value="formState.email"
        type="email"
        :placeholder="t('auth.login.email')"
      >
        <template #prefix>
          <MailOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <!-- Password -->
    <a-form-item :label="t('auth.login.password')" name="password">
      <a-input-password
        v-model:value="formState.password"
        size="large"
        :placeholder="t('auth.login.password')"
      >
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <!-- Remember Me & Forgot Password -->
    <div class="flex items-center justify-between">
      <div class="flex items-center"></div>

      <div class="flex align-items-center justify-between mb-2">
        <RouterLink
          to="/auth/forgot-password"
          class="font-medium text-primary hover:text-blue-500 transition-colors"
        >
          Forgot password?
        </RouterLink>
      </div>
    </div>

    <!-- Login Button -->
    <a-form-item>
      <a-button type="primary" html-type="submit" size="large" :loading="isLoading" block>
        {{ isLoading ? 'Signing in...' : 'Sign in' }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped></style>
