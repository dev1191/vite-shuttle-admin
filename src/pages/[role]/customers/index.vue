<script setup lang="ts"></script>

<template>
  <div>
    <CustomerTable />
  </div>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageCustomers.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, 'super-admin', staff, manager]
  hidden: false
  breadcrumb:
    - manageCustomers.title
</route>

<style scoped></style>
