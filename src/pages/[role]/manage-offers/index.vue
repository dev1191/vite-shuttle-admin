<script setup lang="ts"></script>

<template>
  <div>
    <OfferTable />
  </div>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: offers.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - offers.title
</route>

<style scoped></style>
