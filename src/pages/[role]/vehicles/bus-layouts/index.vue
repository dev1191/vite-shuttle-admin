<script setup lang="ts"></script>

<template>
  <div>
    <BusLayoutTable />
  </div>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: vehicles.busLayouts.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - vehicles.title
    - vehicles.busLayouts.title
</route>

<style scoped></style>
