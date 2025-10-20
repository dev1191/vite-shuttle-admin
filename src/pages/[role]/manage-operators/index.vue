<script setup lang="ts"></script>

<template>
  <div>
    <OperatorTable />
  </div>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageOperators.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, operator, staff, manager]
  hidden: false
  breadcrumb:
    - manageOperators.title
</route>

<style scoped></style>
