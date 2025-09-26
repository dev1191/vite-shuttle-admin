<script setup lang="ts"></script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: managedrivers.drivers.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - managedrivers.title
    - managedrivers.create
</route>

<template>
  <div>
    <h1>Driver create Page</h1>
  </div>
</template>

<style scoped></style>
