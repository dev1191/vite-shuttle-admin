<script setup lang="ts">
import { SettingOutlined } from '@ant-design/icons-vue'
import { themeColors } from '@/settings/layout.setting'
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

const { t } = useI18n()
const layoutSettingStore = useLayoutSettingStore()
const colorPrimary = computed(() => layoutSettingStore.layoutSetting.colorPrimary)
const colorPickerStyle = computed(() => ({
  '--custom-color': colorPrimary.value,
}))

const visible = ref(false)
const showDrawer = () => {
  visible.value = true
}

const setThemeColor = (colorPrimary: any) => {
  layoutSettingStore.updateLayoutSetting({ colorPrimary })
}

const getThemeColorVisible = (color: string) =>
  colorPrimary.value === color ? 'visible' : 'hidden'

const handleColorPickerInput = (e) => {
  setThemeColor(e.target.value)
}
</script>

<template>
  <a-tooltip :title="t('settings.title')" :placement="'bottomRight'">
    <SettingOutlined spin :rotate="2" @click="showDrawer" :style="{ fontSize: '16px' }" />
  </a-tooltip>

  <a-drawer v-model:open="visible" placement="right" :title="t('settings.title')">
    <a-descriptions :title="t('settings.menuLayout')" :column="5"> </a-descriptions>

    <a-descriptions :title="t('settings.themeColor')" :column="themeColors.length - 1">
      <a-descriptions-item v-for="item in themeColors" :key="item.key">
        <div class="style-checkbox-item" v-if="item.tag === 'checkbox'">
          <a-tooltip :title="t(item.title)">
            <a-tag :color="item.value" @click="setThemeColor(item.value)">
              <span :style="{ visibility: getThemeColorVisible(item.value) }"> ✔ </span>
            </a-tag>
          </a-tooltip>
        </div>
        <a-flex
          justify="space-between"
          class="w-full flex items-center style-checkbox-item"
          v-if="item.tag === 'input-color'"
        >
          {{ t('settings.customColor') }}
          <a-tag :color="colorPrimary" class="relative overflow-hidden">
            <a-input
              type="color"
              class="cursor-pointer absolute top-0 left-0 rounded-full opacity-0"
              :style="colorPickerStyle"
              v-model="colorPrimary"
              @input="handleColorPickerInput"
            />
            <span :style="{ visibility: getThemeColorVisible(colorPrimary) }"> ✔ </span>
          </a-tag>
        </a-flex>
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<style scoped></style>
