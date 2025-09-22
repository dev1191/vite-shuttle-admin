<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.store'

const userStore = useUserStore()
const userInfo = computed(() => userStore.user)
</script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: profile
  breadcrumb:
    - profile
</route>

<template>
  <div>
    <a-flex justify="space-between">
      <a-card>
        <div class="text-lg font-semibold">User Profile</div>
      </a-card>

      <a-card>
        {{ userInfo }}
        <a-button type="primary" @click="$router.back()">Back</a-button>
      </a-card>
    </a-flex>
  </div>
</template>

<style scoped></style>
