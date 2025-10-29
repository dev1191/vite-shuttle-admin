<script setup lang="ts"></script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: managedrivers.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - manageDrivers.title
</route>

<template>
  <div>
    <DriverTable />
  </div>
</template>

<style scoped></style>
