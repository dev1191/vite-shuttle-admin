<script setup lang="ts"></script>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: helpAndSupports.title
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - helpAndSupports.title
</route>

<template>
  <div>
    <HelpAndSupportTable />
  </div>
</template>

<style scoped></style>
