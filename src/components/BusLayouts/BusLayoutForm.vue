<script setup lang="ts">
import type { BusLayout } from '@/types/busLayouts'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useBusLayouts } from '@/composables/modules/useBusLayouts'

interface Props {
  isEdit: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'submit', formData: BusLayout): void
}
const emit = defineEmits<Emits>()
const { t } = useI18n()
const drawerRef = ref()
const drawerVisible = ref(false)
const isEdit = ref(props.isEdit)
const loading = ref(false)

const { addBusLayout, editBusLayout, fetchBusLayouts } = useBusLayouts()

const formData = reactive({
  name: '',
  seat_capacity: '',
  description: '',
  status: true,
})

const rules: Record<string, Rule[]> = {
  name: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.vehicles.busLayouts.form.name'),
      }),
      trigger: 'blur',
    },
  ],
  seat_capacity: [
    {
      required: true,
      message: t('validation.required', {
        name: t('menu.vehicles.busLayouts.form.seatCapacity'),
      }),
      trigger: 'blur',
    },
  ],
}

function openDrawer(edit = false, record?: BusLayout) {
  isEdit.value = edit
  drawerVisible.value = true
  if (edit && record) Object.assign(formData, record)
}

function handleClose() {
  drawerVisible.value = false
  Object.assign(formData, {
    ids: '',
    name: '',
    seat_capacity: '',
    description: '',
    status: true,
  })
}

async function handleSubmit(formData: BusLayout) {
  try {
    loading.value = true
    emit('submit', formData)
    handleClose()
  } finally {
    loading.value = false
  }
}

defineExpose({
  openDrawer,
  drawerVisible,
  isEdit,
})
</script>

<template>
  <BaseDrawerForm
    ref="drawerRef"
    :visible="drawerVisible"
    :title="isEdit ? 'Edit BusLayout' : 'Create BusLayout'"
    :formData="formData"
    :loading="loading"
    :isEdit="isEdit"
    :rules="rules"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #fields="{ form }">
      <a-form-item :label="t('menu.vehicles.busLayouts.form.name')" name="name">
        <a-input
          size="large"
          v-model:value="form.name"
          :placeholder="
            t('validation.placeholder', { name: t('menu.vehicles.busLayouts.form.name') })
          "
        />
      </a-form-item>
      <a-form-item :label="t('menu.vehicles.busLayouts.form.seatCapacity')" name="seat_capacity">
        <a-input-number
          class="w-full"
          size="large"
          :min="0"
          v-model:value="form.seat_capacity"
          :placeholder="
            t('validation.placeholder', { name: t('menu.vehicles.busLayouts.form.seatCapacity') })
          "
        />
      </a-form-item>

      <a-form-item :label="t('menu.vehicles.busLayouts.form.description')" name="description">
        <a-textarea
          size="large"
          v-model:value="form.description"
          :placeholder="
            t('validation.placeholder', { name: t('menu.vehicles.busLayouts.form.description') })
          "
        />
      </a-form-item>

      <a-form-item :label="t('common.status')" name="status">
        <a-radio-group v-model:value="formData.status">
          <a-radio-button :value="true">{{ t('common.active') }}</a-radio-button>
          <a-radio-button :value="false">{{ t('common.inactive') }}</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </template>
  </BaseDrawerForm>
</template>

<style scoped></style>
