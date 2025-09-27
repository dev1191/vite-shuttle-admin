<script setup lang="ts"></script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageUsers.users
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - manageUsers.title
    - manageUsers.users
</route>

<template>
  <div>
    <h1>Home Page</h1>
  </div>
</template>

<style scoped></style>
