<!-- components/shared/Icon.vue -->
<script setup lang="ts">
const { useRenderIcon } = useRender()
const props = defineProps<{
  name: string
  size?: number | string
  color?: string
  [key: string]: any
}>()

// build render function with composable
const renderFn = useRenderIcon(props.name, {
  width: props.size ?? 12,
  height: props.size ?? 12,
  style: props.color ? { color: props.color } : undefined,
  ...props,
})
</script>

<template>
  <component :is="renderFn" />
</template>
