<script setup lang="ts">
import { i18nSettings } from '@/settings/layout.setting'
import { useLayoutSettingStore } from '@/stores/modules/layout.store'
import { GlobalOutlined } from '@ant-design/icons-vue'
const { t } = useI18n()

const layoutThemeStore = useLayoutSettingStore()

const changeLocaleLanguage = (language: string) => {
  layoutThemeStore.updateLayoutSetting({ language })
}
</script>

<template>
  <a-dropdown>
    <template #overlay>
      <a-menu>
        <a-menu-item
          v-for="item in i18nSettings"
          :key="item.value"
          @click="changeLocaleLanguage(item.value)"
        >
          {{ t(item.label) }}
        </a-menu-item>
      </a-menu>
    </template>
    <GlobalOutlined :style="{ fontSize: '16px' }" />
  </a-dropdown>
</template>

<style scoped></style>
