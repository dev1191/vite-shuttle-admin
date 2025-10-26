<script setup lang="ts"></script>

<template>
  <div>
    <BusTypeTable />
  </div>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: vehicles.busTypes.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - vehicles.title
    - vehicles.busTypes.title
</route>

<style scoped></style>
