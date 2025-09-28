<script setup lang="ts">
import { useRoles } from '@/composables/modules/useRoles'

const { fetchRoles, roles, isLoading } = useRoles()
</script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageRoles.roles
  icon: RolegroupOutlined
  drawerIndex: 1
  order: 3
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - manageRoles.title
    - manageRoles.roles
</route>

<template>
  <div>
    <h1>Roles Page</h1>
    <a-button type="primary">Primary Button</a-button>
  </div>
</template>

<style scoped></style>
