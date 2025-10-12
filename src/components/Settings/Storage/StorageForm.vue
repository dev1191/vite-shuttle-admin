<script setup lang="ts">
interface Props {
  item: any
  isLoading: boolean
}
const props = defineProps<Props>()
interface Emits {
  (e: 'submit', newStorage: any): void
}
const emit = defineEmits<Emits>()
</script>

<template>
  <div></div>
</template>

<style scoped></style>
