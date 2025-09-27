<script setup lang="ts"></script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: vehicles.buses
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - vehicles.title
    - vehicles.buses
</route>

<template>
  <div>
    <h1>Bus Types Page</h1>
  </div>
</template>

<style scoped></style>
