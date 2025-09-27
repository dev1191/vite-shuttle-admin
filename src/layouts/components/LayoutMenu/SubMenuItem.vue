<script setup lang="ts">
import MenuItem from './MenuItem.vue'
import MenuItemContent from './MenuItemContent.vue'
import SubMenuItem from './SubMenuItem.vue'

defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const isShowSubMenu = (menuItem: any) => menuItem?.children?.length
</script>

<template>
  <!-- Sub Menu -->
  <a-sub-menu v-if="isShowSubMenu(item)" v-bind="$attrs" :key="item?.name">
    <template #title>
      <MenuItemContent :item="item" />
    </template>
    <template v-for="child in item.children || []" :key="child.name">
      <SubMenuItem :item="child" />
    </template>
  </a-sub-menu>
  <!-- MenuItem -->
  <MenuItem v-else :item="item" />
</template>

<style scoped></style>
