<script setup lang="ts"></script>

<template>
  <div>
    <PassTable />
  </div>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: passes.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - passes.title
</route>

<style scoped></style>
