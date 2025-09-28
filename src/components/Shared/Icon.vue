<!-- components/shared/Icon.vue -->
<script setup lang="ts">
const props = defineProps<{
  name: string
  size?: number | string
  color?: string
  [key: string]: any
}>()

// build render function with composable
const renderFn = useRenderIcon(props.name, {
  width: props.size ?? 10,
  height: props.size ?? 10,
  style: props.color ? { color: props.color } : undefined,
  ...props,
})
</script>

<template>
  <component :is="renderFn" />
</template>
