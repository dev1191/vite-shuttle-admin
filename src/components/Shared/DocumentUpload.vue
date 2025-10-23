<template>
  <div class="document-upload">
    <a-upload
      v-model:file-list="internalList"
      list-type="picture"
      :before-upload="beforeUpload"
      :on-remove="onRemove"
      :max-count="1"
      :accept="accept"
      @preview="handlePreview"
    >
      <div v-if="!internalList.length">
        <a-button size="large">
          <template #icon>
            <plus-outlined />
          </template>
          {{ uploadText }}
        </a-button>
      </div>
    </a-upload>

    <a-modal v-model:open="previewVisible" footer="null">
      <img alt="preview" :src="previewImage" style="width: 100%" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { UploadFile } from 'ant-design-vue'

interface Props {
  modelValue: string | File | null
  initialUrl?: string
  accept?: string
  uploadText?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  initialUrl: '',
  accept: 'image/*',
  uploadText: 'Upload',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | File | null): void
}>()

const internalList = ref<UploadFile[]>([])
const previewImage = ref('')
const previewVisible = ref(false)
const removedManually = ref(false)

// helpers
function normalizeToUploadFile(value: string | File): UploadFile[] {
  if (!value) return []
  if (typeof value === 'string') {
    return [{ uid: '-1', name: 'no image', url: value }]
  }
  return [{ uid: String(Date.now()), name: value.name, originFileObj: value }]
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// watchers
watch(
  () => [props.modelValue, props.initialUrl],
  async () => {
    if (removedManually.value) return
    if (props.modelValue instanceof File) {
      internalList.value = normalizeToUploadFile(props.modelValue)
      previewImage.value = await toBase64(props.modelValue)
    } else if (typeof props.modelValue === 'string' && props.modelValue) {
      internalList.value = normalizeToUploadFile(props.modelValue)
      previewImage.value = props.modelValue
    } else if (props.initialUrl) {
      internalList.value = normalizeToUploadFile(props.initialUrl)
      previewImage.value = props.initialUrl
      emit('update:modelValue', props.initialUrl)
    } else {
      internalList.value = []
      previewImage.value = ''
    }
  },
  { immediate: true },
)

// upload handlers
function beforeUpload(file: File) {
  removedManually.value = false
  internalList.value = [normalizeToUploadFile(file)[0]]
  emit('update:modelValue', file)
  return false // disable auto-upload
}

function onRemove() {
  removedManually.value = true
  internalList.value = []
  previewImage.value = ''
  emit('update:modelValue', null)
}

function handlePreview(file: UploadFile) {
  previewImage.value =
    file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '')
  previewVisible.value = true
}
</script>

<style scoped></style>
