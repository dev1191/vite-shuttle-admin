<script setup lang="ts">
import type { BusLayout } from '@/types/busLayouts'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useBusLayouts } from '@/composables/modules/useBusLayouts'
import { ReloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'

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

const defaultFormData = {
  name: '',
  seat_capacity: 0,
  layout_mode: 'fixed' as 'fixed' | 'custom',
  status: true,
  total_columns: 0,
  total_rows: 0,
  seats: [] as Seat[],
}

const formData = reactive({ ...defaultFormData })

// Validation rules
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

// Layout constants (could be moved to props)
const gridSize = 60
const canvasWidth = 800
const canvasHeight = 600
const seatWidth = 50
const seatHeight = 50

const canvasRef = ref<HTMLDivElement | null>(null)

function openDrawer(edit = false, record?: BusLayout) {
  localIsEdit.value = edit
  drawerVisible.value = true
  if (edit && record) {
    Object.assign(formData, JSON.parse(JSON.stringify(record)))
  }
}

function handleClose() {
  drawerVisible.value = false
  Object.assign(formData, JSON.parse(JSON.stringify(defaultFormData)))
}

function generateFixedSeats() {
  if (formData.total_rows <= 0 || formData.total_columns <= 0) {
    message.warning(t('validation.rowsAndColumns'))
    return
  }

  const seats: Seat[] = []
  const startX = 50
  const startY = 80

  for (let row = 0; row < formData.total_rows; row++) {
    for (let col = 0; col < formData.total_columns; col++) {
      seats.push({
        seat_number: `${String.fromCharCode(65 + row)}${col + 1}`,
        x: startX + col * gridSize,
        y: startY + row * gridSize,
        type: 'any',
        status: 'available',
      })
    }
  }

  formData.seats = seats
  formData.seat_capacity = seats.length
  message.success(t('validation.generatedSeats', { count: seats.length }))
}

function addCustomSeat() {
  const seatNumber = formData.seats.length + 1
  formData.seats.push({
    seat_number: `S${seatNumber}`,
    x: 50,
    y: 80 + formData.seats.length * gridSize,
    type: 'any',
    status: 'available',
  })
  formData.seat_capacity = formData.seats.length
}

function snapToGrid(value: number) {
  return Math.round(value / gridSize) * gridSize
}

function onSeatDragEnd(seat: Seat, event: DragEvent) {
  if (formData.layout_mode !== 'custom' || !event.clientX || !event.clientY) return
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const newX = event.clientX - rect.left - seatWidth / 2
  const newY = event.clientY - rect.top - seatHeight / 2
  seat.x = Math.min(Math.max(0, snapToGrid(newX)), canvasWidth - seatWidth)
  seat.y = Math.min(Math.max(0, snapToGrid(newY)), canvasHeight - seatHeight)
}

function updateSeatPosition(seat: Seat, event: DragEvent) {
  if (formData.layout_mode !== 'custom' || !event.clientX || !event.clientY) return
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const newX = event.clientX - rect.left - seatWidth / 2
  const newY = event.clientY - rect.top - seatHeight / 2
  seat.x = Math.min(Math.max(0, snapToGrid(newX)), canvasWidth - seatWidth)
  seat.y = Math.min(Math.max(0, snapToGrid(newY)), canvasHeight - seatHeight)
}

function removeSeat(index: number) {
  formData.seats.splice(index, 1)
  formData.seat_capacity = formData.seats.length
}

function clearAllSeats() {
  formData.seats = []
  formData.seat_capacity = 0
}

const isSeatDraggable = computed(() => formData.layout_mode === 'custom')

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

defineExpose({
  openDrawer,
  drawerVisible,
  localIsEdit,
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
          <a-form-item :label="t('menu.vehicles.busLayouts.form.name')" name="name">
            <a-input
              size="large"
              v-model:value="form.name"
              :placeholder="
                t('validation.placeholder', { name: t('menu.vehicles.busLayouts.form.name') })
              "
            />
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
              disabled
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

      <a-divider orientation="left">{{ t('menu.vehicles.busLayouts.layoutConfig') }}</a-divider>

      <div v-if="formData.layout_mode === 'fixed'">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item :label="t('menu.vehicles.busLayouts.totalRows')" name="total_rows">
              <a-input-number
                class="w-full"
                size="large"
                :min="1"
                :max="10"
                v-model:value="formData.total_rows"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="t('menu.vehicles.busLayouts.totalColumns')" name="total_columns">
              <a-input-number
                class="w-full"
                size="large"
                :min="1"
                :max="10"
                v-model:value="formData.total_columns"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label=" " colon>
              <a-button
                type="primary"
                size="large"
                @click="generateFixedSeats"
                :icon="h(ReloadOutlined)"
              >
                {{ t('menu.vehicles.busLayouts.generateSeats') }}
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <div v-if="formData.layout_mode === 'custom'">
        <a-space class="mb-4">
          <a-button type="primary" @click="addCustomSeat" :icon="h(PlusOutlined)">
            {{ t('menu.vehicles.busLayouts.addSeat') }}
          </a-button>
          <a-button danger @click="clearAllSeats" :icon="h(DeleteOutlined)">
            {{ t('common.clearAll') }}
          </a-button>
        </a-space>
      </div>

      <div v-if="formData.seats.length > 0" class="mt-6">
        <a-divider orientation="left">{{ t('menu.vehicles.busLayouts.preview') }}</a-divider>

        <div
          ref="canvasRef"
          id="seat-canvas"
          class="relative border-2 border-dashed border-gray-300 bg-gray-50 mx-auto overflow-hidden"
          :style="{
            width: canvasWidth + 'px',
            height: canvasHeight + 'px',
            backgroundImage:
              'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
            backgroundSize: gridSize + 'px ' + gridSize + 'px',
          }"
        >
          <div
            class="absolute top-10px left-10px px-4 py-2 bg-blue-500 text-white rounded font-semibold"
          >
            🚗 {{ t('menu.vehicles.busLayouts.driver') }}
          </div>

          <div
            v-for="(seat, index) in formData.seats"
            :key="index"
            :draggable="isSeatDraggable"
            @dragend="onSeatDragEnd(seat, $event)"
            @drag="updateSeatPosition(seat, $event)"
            :class="[
              'absolute',
              isSeatDraggable ? 'cursor-move' : 'cursor-not-allowed',
              formData.layout_mode === 'fixed' ? 'select-none pointer-events-none' : '',
            ]"
            :style="{
              left: seat.x + 'px',
              top: seat.y + 'px',
              width: seatWidth + 'px',
              height: seatHeight + 'px',
            }"
          >
            <a-card
              :bodyStyle="{ padding: '4px', textAlign: 'center' }"
              class="h-full"
              :class="{
                'border-2': true,
                'border-blue-500': seat.type === 'male',
                'border-red-500': seat.type === 'female',
                'border-green-500': seat.type === 'any',
                'bg-gray-100': seat.status === 'booked',
                'bg-white': seat.status === 'available',
                'opacity-80': formData.layout_mode === 'fixed',
              }"
            >
              <div class="text-xs font-semibold">{{ seat.seat_number }}</div>
              <div class="text-10px mt-0.5">
                {{ seat.type === 'any' ? '👤' : seat.type === 'male' ? '👨' : '👩' }}
              </div>
            </a-card>

            <div v-if="formData.layout_mode === 'custom'" class="absolute -top-2 -right-2">
              <a-button
                type="primary"
                danger
                size="small"
                shape="circle"
                @click="removeSeat(index)"
                :icon="h(DeleteOutlined)"
              />
            </div>
          </div>
        </div>

        <div class="mt-6">
          <a-divider orientation="left">{{ t('menu.vehicles.busLayouts.seatConfig') }}</a-divider>
          <a-table
            :dataSource="formData.seats"
            :columns="[
              {
                title: t('menu.vehicles.busLayouts.seatNumber'),
                dataIndex: 'seat_number',
                key: 'seat_number',
                width: 150,
              },
              { title: 'X', dataIndex: 'x', key: 'x', width: 100 },
              { title: 'Y', dataIndex: 'y', key: 'y', width: 100 },
              {
                title: t('menu.vehicles.busLayouts.type'),
                dataIndex: 'type',
                key: 'seat_type',
                width: 130,
              },
              {
                title: t('menu.vehicles.busLayouts.status'),
                dataIndex: 'status',
                key: 'seat_status',
                width: 150,
              },
              { title: t('common.actions'), key: 'actions', width: 100 },
            ]"
            :pagination="{ pageSize: 10 }"
            size="small"
            :scroll="{ x: true }"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'seat_number'">
                <a-input
                  v-model:value="record.seat_number"
                  size="small"
                  :disabled="formData.layout_mode === 'fixed'"
                />
              </template>
              <template v-else-if="column.key === 'seat_type'">
                <a-select v-model:value="record.type" size="small" class="w-100px">
                  <a-select-option value="any">Any</a-select-option>
                  <a-select-option value="male">Male</a-select-option>
                  <a-select-option value="female">Female</a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.key === 'seat_status'">
                <a-select v-model:value="record.status" size="small" class="w-120px">
                  <a-select-option value="available">Available</a-select-option>
                  <a-select-option value="booked">Booked</a-select-option>
                </a-select>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-button
                  v-if="formData.layout_mode === 'custom'"
                  type="link"
                  danger
                  size="small"
                  @click="removeSeat(index)"
                >
                  {{ t('common.delete') }}
                </a-button>
                <span v-else class="text-gray-400">—</span>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </template>
  </BaseDrawerForm>
</template>
