<script setup lang="ts">
import { SettingOutlined } from '@ant-design/icons-vue'

const { t } = useI18n()
const visible = ref(false)
const showDrawer = () => {
  visible.value = true
}
</script>

<template>
  <a-tooltip :title="t('setting.projectConfig')" :placement="'bottomRight'">
    <SettingOutlined @click="showDrawer" />
  </a-tooltip>

  <a-drawer v-model:open="visible" placement="right" :title="t('setting.projectConfig')">
    <a-descriptions :title="t('setting.menuLayout')" :column="5"> </a-descriptions>
  </a-drawer>
</template>

<style scoped></style>
