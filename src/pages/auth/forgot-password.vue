<script setup lang="ts">
const { t } = useI18n()
</script>

<route lang="yaml">
meta:
  layout: authLayout
  title: forgotPassword
  hidden: true
</route>

<template>
  <div>
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {{ t('auth.forgotPassword.title') }}
      </h2>
      <p class="text-gray-500">{{ t('auth.forgotPassword.subTitle') }}</p>
    </div>

    <ForgotPasswordForm />
  </div>
</template>

<style scoped></style>
