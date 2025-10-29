<template>
  <div class="flex">
    <!-- Left: Seat layout -->
    <div class="flex-1 p-4">
      <div class="flex flex-wrap gap-2 mb-2 items-center">
        <a-input-number v-model:value="rows" :min="1" :max="20" placeholder="Rows" />
        <a-input-number v-model:value="cols" :min="1" :max="10" placeholder="Cols" />
        <a-button type="primary" @click="generateSeats">Generate Grid</a-button>
        <a-button @click="addSeat">Add Seat</a-button>
        <a-button danger @click="clearSeats">Clear</a-button>
        <a-button @click="saveLayout">Save</a-button>
        <a-button @click="loadLayout">Load</a-button>

        <a-radio-group v-model:value="steeringSide" class="ml-4">
          <a-radio value="left">Left</a-radio>
          <a-radio value="right">Right</a-radio>
        </a-radio-group>

        <div class="ml-6 text-sm font-medium">
          Total Seats: <span class="text-blue-600">{{ totalSeats }}</span>
        </div>
      </div>

      <v-stage
        ref="stageRef"
        :config="{ width, height, draggable: true, scaleX: scale, scaleY: scale }"
      >
        <!--    @wheel="handleZoom"-->
        <v-layer>
          <v-rect
            :config="{ x: 0, y: 0, width, height, fill: '#f4f4f4' }"
            class="border-2 border-dashed border-gray-300"
          />

          <!-- Seats -->
          <v-group v-for="seat in seats" :key="seat.id" class="cursor-pointer">
            <v-image
              :config="{
                x: seat.x,
                y: seat.y,
                width: seatWidth,
                height: seatHeight,
                image: seatImages[seat.type],
                draggable: true,
                shadowBlur: selectedSeat?.id === seat.id ? 20 : 0,
                cornerRadius: 20,
              }"
              @dragend="(e) => onDragEnd(e, seat)"
              @click="() => selectSeat(seat)"
              @dblclick="() => toggleType(seat)"
            />

            <!-- <v-text
              :config="{
                x: seat.x + 6,
                y: seat.y + 4,
                text: seat.label,
                fontSize: 15,
                fill: '#000',
              }"
            /> -->

            <v-text
              :config="{
                x: seat.x + seatWidth - 10,
                y: seat.y - 8,
                text: '❌',
                fontSize: 12,
                fill: '#f44336',
                cursor: 'pointer',
              }"
              @click="() => removeSeat(seat.id)"
            />
          </v-group>

          <!-- Steering -->
          <v-image
            v-if="steeringImg"
            :config="{
              image: steeringImg,
              x: steeringSide === 'left' ? 30 : width - 100,
              y: 10,
              width: 60,
              height: 60,
            }"
          />
        </v-layer>
      </v-stage>
    </div>

    <!-- Right: Edit Form -->
    <div class="w-72 border-l p-4 bg-gray-50 mt-30" v-if="selectedSeat">
      <h3 class="text-lg font-semibold mb-3">Edit Seat : {{ selectedSeat.label }}</h3>
      <a-form layout="vertical">
        <a-form-item label="Label">
          <a-input size="large" v-model:value="selectedSeat.label" />
        </a-form-item>

        <a-form-item label="Seat Type">
          <a-radio-group size="large" v-model:value="selectedSeat.type">
            <a-radio-button value="male">Male</a-radio-button>
            <a-radio-button value="old">Old</a-radio-button>
            <a-radio-button value="female">Female</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="X Position">
              <a-input-number size="large" v-model:value="selectedSeat.x" :min="0" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Y Position">
              <a-input-number size="large" v-model:value="selectedSeat.y" :min="0" />
            </a-form-item>
          </a-col>
        </a-row> -->

        <a-button type="primary" size="large" class="mt-5" block @click="updateSeat"
          >Apply Changes</a-button
        >
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'

const rows = ref(5)
const cols = ref(4)
const seatWidth = 60
const seatHeight = 60
const gap = 10
const width = computed(() => cols.value * (seatWidth + gap) + 150)
const height = computed(() => rows.value * (seatHeight + gap) + 250)
const scale = ref(1)

const steeringSide = ref<'left' | 'right'>('left')
const steeringImg = ref<HTMLImageElement | null>(null)
const stageRef = ref()

const seatImages = ref<{
  male: HTMLImageElement | null
  old: HTMLImageElement | null
  female: HTMLImageElement | null
}>({
  male: null,
  old: null,
  female: null,
})

interface Seat {
  id: string
  x: number
  y: number
  label: string
  type: 'male' | 'old' | 'female'
  selected: boolean
}

const seats = ref<Seat[]>([])
const selectedSeat = ref<Seat | null>(null)
const totalSeats = computed(() => seats.value.length)

onMounted(() => {
  const loadImg = (src: string) => {
    const img = new Image()
    img.src = src
    return img
  }

  seatImages.value.male = loadImg('/images/seat-male.svg')
  seatImages.value.old = loadImg('/images/seat-old.svg')
  seatImages.value.female = loadImg('/images/seat-female.svg')

  const img = new Image()
  img.src = '/images/steering.svg'
  img.onload = () => (steeringImg.value = img)
})

function generateSeats() {
  seats.value = []
  for (let r = 0; r < rows.value; r++) {
    for (let c = 0; c < cols.value; c++) {
      const id = crypto.randomUUID()
      const label = String.fromCharCode(65 + r) + (c + 1)
      seats.value.push({
        id,
        x: c * (seatWidth + gap) + 40,
        y: r * (seatHeight + gap) + 100,
        label,
        type: 'male',
        selected: false,
      })
    }
  }
}

function addSeat() {
  const id = crypto.randomUUID()
  const nextIndex = seats.value.length + 1
  const rowLetter = String.fromCharCode(65 + Math.floor(nextIndex / 10))
  const label = `${rowLetter}${nextIndex % 10 || 1}`
  seats.value.push({
    id,
    x: 40,
    y: 100,
    label,
    type: 'male',
    selected: false,
  })
}

function selectSeat(seat: Seat) {
  selectedSeat.value = seat
}

function onDragEnd(e, seat) {
  const node = e.target
  seat.x = node.x()
  seat.y = node.y()
  if (selectedSeat.value?.id === seat.id) updateSeat()
}

function toggleType(seat) {
  if (seat.type === 'male') seat.type = 'old'
  else if (seat.type === 'old') seat.type = 'female'
  else seat.type = 'male'
}

function removeSeat(id: string) {
  seats.value = seats.value.filter((s) => s.id !== id)
  if (selectedSeat.value?.id === id) selectedSeat.value = null
}

function updateSeat() {
  message.success('Seat updated')
}

function clearSeats() {
  seats.value = []
  selectedSeat.value = null
}

function saveLayout() {
  const data = {
    seats: seats.value,
    steeringSide: steeringSide.value,
    rows: rows.value,
    cols: cols.value,
  }
  localStorage.setItem('busLayout', JSON.stringify(data))
  message.success('Layout saved')
}

function loadLayout() {
  const data = localStorage.getItem('busLayout')
  if (data) {
    const parsed = JSON.parse(data)
    seats.value = parsed.seats || []
    steeringSide.value = parsed.steeringSide
    rows.value = parsed.rows
    cols.value = parsed.cols
    message.success('Layout loaded')
  } else {
    message.error('No layout found')
  }
}

function handleZoom(e) {
  e.evt.preventDefault()
  const stage = stageRef.value.getNode()
  const oldScale = scale.value
  const pointer = stage.getPointerPosition()
  const zoomAmount = e.evt.deltaY > 0 ? 0.9 : 1.1
  const newScale = oldScale * zoomAmount
  scale.value = newScale

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  }

  stage.scale({ x: newScale, y: newScale })
  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  }
  stage.position(newPos)
  stage.batchDraw()
}
</script>

<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>
