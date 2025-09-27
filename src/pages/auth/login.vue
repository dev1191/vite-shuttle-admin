<script setup lang="ts">
const { t } = useI18n()
</script>

<route lang="yaml">
meta:
  layout: authLayout
  title: login
  hidden: true
</route>

<template>
  <div>
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold">Welcome Back 👋🏻</h2>
      <p class="text-gray-500">{{ t('auth.login.subTitle') }}</p>
    </div>

    <LoginForm />
  </div>
</template>

<style scoped></style>
