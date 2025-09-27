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
    - managedrivers.drivers
</route>

<template>
  <div>
    <h1>Driver Page</h1>
  </div>
</template>

<style scoped></style>
