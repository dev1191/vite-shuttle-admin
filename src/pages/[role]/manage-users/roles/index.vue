<script setup lang="ts"></script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageUsers.roles
  icon: UsergroupOutlined
  drawerIndex: 1
  order: 3
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - manageUsers.title
    - manageUsers.roles
</route>

<template>
  <div>
    <h1>Roles Page</h1>
    <a-button type="primary">Primary Button</a-button>
  </div>
</template>

<style scoped></style>
