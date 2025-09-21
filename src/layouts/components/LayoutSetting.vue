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

const visible = ref<boolean>(false)
const baseRadius = ref<number>(layoutSettingStore.layoutSetting.borderRadius)
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

const onChange = (borderRadius: number) => {
  layoutSettingStore.updateLayoutSetting({ borderRadius })
}

const setMenuTheme = (algorithm: string) => {
  layoutSettingStore.updateLayoutSetting({ algorithm: algorithm })
}

watch(baseRadius, (val) => {
  onChange(val)
})
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
    <a-descriptions :title="t('settings.themeStyle')" :column="2">
      <a-descriptions-item>
        <div class="flex gap-3 justify-between w-full">
          <a-tooltip v-for="item in themeAlgorithmOptions" :key="item.value" :title="t(item.label)">
            <a-button
              block
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
    <a-descriptions :title="t('settings.borderRadius')"> </a-descriptions>
    <a-row>
      <a-col :span="12">
        <a-slider :tooltip-open="true" v-model:value="baseRadius" :min="1" :max="16" />
      </a-col>
      <a-col :span="12">
        <div class="flex flex-wrap gap-1 justify-between">
          <a-input-number v-model:value="baseRadius" :min="1" :max="16" style="margin-left: 16px" />
          <a-button
            type="link"
            class="p-0 m-0"
            @click="baseRadius = 6"
            :style="{ marginLeft: '16px', padding: 0 }"
          >
            Reset
          </a-button>
        </div>
      </a-col>
    </a-row>
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
