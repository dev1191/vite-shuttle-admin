<script setup lang="ts">
import { LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { message, notification } from 'ant-design-vue'
import { fetchLogin, getProfile } from '@/common/api/auth'
import { useAuthStore } from '@/stores/modules/auth.store'
import { useUserStore } from '@/stores/modules/user.store'
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

const { t } = useI18n()
const authStore = useAuthStore()
const userStore = useUserStore()
const { layoutSetting } = useLayoutSettingStore()
const router = useRouter()
const isLoading = ref(false)
const formRef = ref()
const systemName = computed(() => layoutSetting.title)
const formState = ref({
  email: '',
  password: '',
})

const rules: Record<string, Rule[]> = {
  email: [
    {
      required: true,
      message: t('validation.required', { name: t('auth.login.email') }),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('validation.required', { name: t('auth.login.password') }),
      trigger: 'blur',
    },
  ],
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validateFields()
    message.loading('loading...', 0)

    isLoading.value = true

    const { email, password } = formState.value
    const res = await fetchLogin({ email, password })

    authStore.setToken(res.token, res.refreshToken, res.expiresIn)
    const profile = await getProfile() // call getProfile after login
    userStore.setUser(profile)

    router.push({ path: `/${profile.role.toLowerCase()}/dashboard` })

    showLoginSuccessNotice()
    message.destroy()
  } catch (error: unknown) {
    console.error('Submit error:', error)

    // Handle known HttpError or generic error
    const errMsg = (error as any)?.message || t('auth.failed')

    message.destroy()
    message.error(errMsg)
  } finally {
    isLoading.value = false
  }
}

const showLoginSuccessNotice = () => {
  setTimeout(() => {
    notification.success({
      message: t('auth.success.title'),
      description: `${t('auth.success.message')}, ${systemName.value}!`,
    })
  }, 150)
}
</script>

<template>
  <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules" @finish="handleSubmit">
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
