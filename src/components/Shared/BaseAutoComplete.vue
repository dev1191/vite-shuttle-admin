<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { SelectProps } from 'ant-design-vue'

const props = defineProps({
  /** Form props */
  label: String,
  name: String,
  rules: {
    type: Array as () => Rule[],
    default: () => [],
  },
  hasFeedback: {
    type: Boolean,
    default: false,
  },

  /** AutoComplete props */
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array as () => SelectProps['options'],
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Type to search...',
  },
  allowClear: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '100%',
  },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'select', 'search'])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val
  },
)

watch(internalValue, (val) => {
  emit('update:modelValue', val)
})

const onSelect = (value: string, option: any) => {
  emit('select', value, option)
}

const onSearch = (value: string) => {
  emit('search', value)
}
</script>

<template>
  <a-form-item :label="label" :name="name" :rules="rules" :has-feedback="hasFeedback">
    <a-auto-complete
      v-model:value="internalValue"
      :options="options"
      :placeholder="placeholder"
      :allow-clear="allowClear"
      :disabled="disabled"
      backfill
      :style="{ width }"
      @select="onSelect"
      @search="onSearch"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >
      <template #clearIcon>
        <CloseOutlined />
      </template>

      <template #option="{ value, label, ...option }">
        <slot name="option" :value="value" :label="label" :option="option">
          <!-- Default fallback rendering -->
          {{ label || value }}
        </slot>
      </template>
    </a-auto-complete>
  </a-form-item>
</template>
