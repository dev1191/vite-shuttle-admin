<script setup lang="ts">
import { i18nSettings } from '@/settings/layout.setting'
import { useLayoutSettingStore } from '@/stores/modules/layout.store'
import { GlobalOutlined, CheckOutlined } from '@ant-design/icons-vue'
const { t } = useI18n()

const layoutThemeStore = useLayoutSettingStore()

const activeLanguage = computed(() => layoutThemeStore.layoutSetting.language)

const changeLocaleLanguage = (language: string) => {
  console.log('Changing language to:', language, activeLanguage.value)
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
          <span class="flex items-center gap-2">
            <component :is="item.icon" />
            <span>{{ t(item.label) }}</span>

            <!-- ✅ Show checkmark if active -->
            <CheckOutlined v-if="activeLanguage === item.value" class="ml-auto text-blue-500" />
          </span>
        </a-menu-item>
      </a-menu>
    </template>

    <!-- Show active language instead of just globe -->
    <span class="flex items-center gap-2 cursor-pointer">
      <component
        :is="i18nSettings.find((i) => i.value === activeLanguage)?.icon"
        v-if="i18nSettings.find((i) => i.value === activeLanguage)"
      />
      <span>{{ t(i18nSettings.find((i) => i.value === activeLanguage)?.label || '') }}</span>
    </span>
  </a-dropdown>
</template>
