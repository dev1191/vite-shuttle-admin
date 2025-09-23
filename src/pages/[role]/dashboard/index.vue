<script setup lang="ts"></script>

<route lang="yaml">
meta:
  layout: defaultLayout
  icon: fluent:apps-28-filled
  title: dashboard
  order: 1
  hidden: false
  roles: [admin, user, manager]
  breadcrumb:
    - dashboard
</route>

<template>
  <div>
    <h1>Dashboard</h1>
  </div>
</template>

<style scoped></style>
