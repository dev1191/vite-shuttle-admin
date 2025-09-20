<script setup lang="ts">
import { CheckOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { themeColors, themeAlgorithmOptions } from '@/settings/layout.setting'
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

const { t } = useI18n()
const layoutSettingStore = useLayoutSettingStore()
const layoutSetting = computed(() => layoutSettingStore.layoutSetting)
const colorPrimary = computed(() => layoutSettingStore.layoutSetting.colorPrimary)
const colorPickerStyle = computed(() => ({
  '--custom-color': colorPrimary.value,
  color: '#fff',
}))

const visible = ref(false)
const baseRadius = ref(layoutSettingStore.layoutSetting.borderRadius)
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

const setLayout = (layout: any) => {
  layoutSettingStore.updateLayoutSetting({ layout })
}

const onChange = (borderRadius: number) => {
  layoutSettingStore.updateLayoutSetting({ borderRadius })
}

const setMenuTheme = (algorithm: string) => {
  layoutSettingStore.updateLayoutSetting({ algorithm: algorithm })
}

const onAfterChange = (borderRadius: number) => {
  layoutSettingStore.updateLayoutSetting({ borderRadius })
}
</script>

<template>
  <a-tooltip :title="t('settings.title')" :placement="'bottomRight'">
    <SettingOutlined spin :rotate="2" @click="showDrawer" :style="{ fontSize: '16px' }" />
  </a-tooltip>

  <a-drawer v-model:open="visible" placement="right" :title="t('settings.title')">
    <a-descriptions :title="t('settings.themeColor')" :column="themeColors.length - 1">
      <a-descriptions-item v-for="item in themeColors" :key="item.key">
        <div class="style-checkbox-item" v-if="item.tag === 'checkbox'">
          <a-tooltip :title="t(item.title)">
            <a-tag :color="item.value" @click="setThemeColor(item.value)">
              <span :style="{ visibility: getThemeColorVisible(item.value) }">
                <CheckOutlined :style="{ fontSize: '16px' }" />
              </span>
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
            <span :style="{ visibility: getThemeColorVisible(colorPrimary) }">
              <CheckOutlined :style="{ fontSize: '16px' }" />
            </span>
          </a-tag>
        </a-flex>
      </a-descriptions-item>
    </a-descriptions>

    <!-- Menu Theme Switch -->
    <a-descriptions :title="t('settings.menuTheme')" :column="2">
      <a-descriptions-item>
        <div class="flex gap-3 flex-wrap">
          <a-tooltip v-for="item in themeAlgorithmOptions" :key="item.value" :title="t(item.label)">
            <a-button
              size="large"
              type="default"
              :class="['flex items-center gap-2']"
              @click="setMenuTheme(item.value)"
            >
              <component :is="item.icon" />
              {{ t(item.label) }}
            </a-button>
          </a-tooltip>
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <!-- Border Radius -->
    <a-descriptions :title="t('settings.borderRadius')">
      <a-slider
        v-model:value="baseRadius"
        :min="1"
        :max="10"
        @change="onChange"
        @afterChange="onAfterChange"
      />
    </a-descriptions>
  </a-drawer>
</template>

<style scoped>
.style-checkbox-item {
  position: relative;
  cursor: pointer;
}
input[type='color'] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  outline: none;
  appearance: none;
  &::-webkit-color-swatch-wrapper {
    background: var(--custom-color);
  }
  &::-webkit-color-swatch {
    display: none;
  }
}
</style>
