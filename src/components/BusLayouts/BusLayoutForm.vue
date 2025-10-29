<script setup lang="ts">
import type { BusLayout } from '@/types/busLayouts'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useBusLayouts } from '@/composables/modules/useBusLayouts'
import { ReloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useOptions } from '@/composables/modules/useOptions'

interface Props {
  isEdit: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'submit', formData: BusLayout): void
}
const emit = defineEmits<Emits>()

interface Seat {
  seat_number: string
  x: number
  y: number
  type: 'male' | 'female' | 'any'
  status: 'available' | 'booked'
}

const { t } = useI18n()
const drawerRef = ref()
const drawerVisible = ref(false)
const localIsEdit = ref(props.isEdit)
const loading = ref(false)

const { addBusLayout, editBusLayout } = useBusLayouts()
const { busTypeOptions, searchBusType, fetchBusTypes } = useOptions()

const defaultFormData = {
  busTypeId: '',
  name: '',
  seat_capacity: 0,
  layout_mode: 'fixed' as 'fixed' | 'custom',
  status: true,
  layout: {
    rows: 8,
    cols: 4,
    steeringSide: 'left' as 'left' | 'right',
    seats: [] as Seat[],
  },
}

const formData = reactive({ ...defaultFormData })

watch(
  () => formData.layout.seats,
  (seats) => {
    formData.seat_capacity = seats.length
  },
  { deep: true },
)

watch(
  () => formData.layout_mode,
  (mode) => {
    if (mode === 'fixed') {
      formData.seat_capacity = 0
      formData.layout = {
        rows: 8,
        cols: 4,
        steeringSide: 'left',
        seats: [],
      }
    }
  },
)

// validation
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
  localIsEdit.value = edit
  drawerVisible.value = true
  if (edit && record) {
  }
}

function handleClose() {
  drawerVisible.value = false
  Object.assign(formData, JSON.parse(JSON.stringify(defaultFormData)))
}

async function handleSubmit(formData: BusLayout) {
  try {
    loading.value = true
    if (!formData.name || !formData.seat_capacity) {
      message.warning(t('validation.requiredFields'))
      return
    }
    emit('submit', { ...formData })
    handleClose()
  } finally {
    loading.value = false
  }
}

const handleCountryBusType = (query: string) => {
  searchBusType.value = query
}

defineExpose({
  openDrawer,
  drawerVisible,
  localIsEdit,
})

onMounted(() => {
  fetchBusTypes()
})
</script>

<template>
  <BaseDrawerForm
    ref="drawerRef"
    :width="850"
    :visible="drawerVisible"
    :title="localIsEdit ? t('menu.vehicles.busLayouts.edit') : t('menu.vehicles.busLayouts.create')"
    :formData="formData"
    :loading="loading"
    :isEdit="localIsEdit"
    :rules="rules"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #fields="{ form }">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item name="busTypeId">
            <BaseAutoComplete
              v-model="formData.busTypeId"
              :label="t('menu.vehicles.busLayouts.form.busType')"
              name="busTypeId"
              :options="busTypeOptions"
              placeholder="Search or select a bus type"
              @search="handleCountryBusType"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('menu.vehicles.busLayouts.form.name')" name="name">
            <a-input size="large" v-model:value="form.name" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item :label="t('menu.vehicles.busLayouts.form.layoutMode')" name="layout_mode">
            <a-radio-group size="large" v-model:value="formData.layout_mode">
              <a-radio-button value="fixed">{{
                t('menu.vehicles.busLayouts.fixed')
              }}</a-radio-button>
              <a-radio-button value="custom">{{
                t('menu.vehicles.busLayouts.custom')
              }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            :label="t('menu.vehicles.busLayouts.form.seatCapacity')"
            name="seat_capacity"
          >
            <a-input-number
              class="w-full"
              size="large"
              :min="0"
              v-model:value="form.seat_capacity"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('common.status')" name="status">
            <a-radio-group size="large" v-model:value="formData.status">
              <a-radio-button :value="true">{{ t('common.active') }}</a-radio-button>
              <a-radio-button :value="false">{{ t('common.inactive') }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>

      <div v-if="formData.layout_mode === 'custom'">
        <a-divider orientation="left">{{ t('menu.vehicles.busLayouts.layoutConfig') }}</a-divider>

        <BusLayoutKonva v-model="formData.layout" />
      </div>
    </template>
  </BaseDrawerForm>
</template>
