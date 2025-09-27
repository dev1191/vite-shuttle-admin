<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.store'

const { t } = useI18n()
const userStore = useUserStore()
const userInfo = computed(() => userStore.user)
</script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: profile
  icon: UserOutlined
  hidden: false
  roles: [admin, user, manager]
  breadcrumb:
    - profile
</route>

<template>
  <div>
    <a-flex gap="middle" justify="space-between">
      <a-card>
        <div class="text-lg font-semibold">User Profile</div>
      </a-card>

      <div>
        <a-card :title="t('user.userProfile')" :body-style="{ padding: 0, overflow: 'hidden' }">
          {{ userInfo }}
        </a-card>

        <a-card>
          <a-button type="primary" @click="$router.back()">Back</a-button>
        </a-card>
      </div>
    </a-flex>
  </div>
</template>

<style scoped></style>
