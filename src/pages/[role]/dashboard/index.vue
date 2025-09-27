<script setup lang="ts"></script>

<route lang="yaml">
meta:
  layout: defaultLayout
  icon: fluent:apps-28-filled
  title: dashboard
  drawerIndex: 0
  order: 1
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - dashboard
</route>

<template>
  <div>
    <h1>Dashboard</h1>
  </div>
</template>

<style scoped></style>
