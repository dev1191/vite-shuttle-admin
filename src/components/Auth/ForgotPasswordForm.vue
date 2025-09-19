<script setup lang="ts">
import { MailOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'

const { t } = useI18n()
const route = useRouter()
const isLoading = ref(false)
const formRef = ref()
const formState = ref({
  email: '',
})

const rules: Record<string, Rule[]> = {
  email: [
    {
      required: true,
      type: 'email',
      message: t('validation.required', { name: t('auth.login.email') }),
      trigger: ['blur', 'change'],
    },
  ],
}

const handleSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      isLoading.value = true
      message.loading(t('auth.sending'), 0)

      // Simulate API call
      setTimeout(() => {
        isLoading.value = false
        message.destroy()
        message.success(t('auth.resetLinkSent'))
        console.log('Reset link sent to:', formState.value.email)
      }, 2000)
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

    <!-- Submit -->
    <a-form-item>
      <a-button type="primary" html-type="submit" size="large" :loading="isLoading" block>
        {{ isLoading ? t('common.sending') : t('common.submit') }}
      </a-button>
      <!-- Back to Login -->
      <div class="text-center mt-2">
        <a-button block size="large" @click="route.push('/auth/login')">
          {{ t('common.back') }}
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>
