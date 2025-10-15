<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Props {
  modelValue?: File | string | null
  size?: number
  shape?: 'circle' | 'square' // default circle
  label?: string
  maxSizeMB?: number
}

interface Emits {
  (e: 'update:modelValue', value: File | string | null): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
  shape: 'circle', // ✅ default avatar shape
  label: 'Upload',
  maxSizeMB: 2,
})

const emit = defineEmits<Emits>()

const loading = ref(false)
const previewUrl = ref<string>('')

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('Only image files are allowed!')
    return false
  }
  const isLt = file.size / 1024 / 1024 < props.maxSizeMB
  if (!isLt) {
    message.error(`Image must be smaller than ${props.maxSizeMB}MB!`)
    return false
  }
  return true
}

const handleChange = ({ file }: any) => {
  if (!file?.originFileObj) return
  loading.value = true
  try {
    const selectedFile = file.originFileObj as File
    emit('update:modelValue', selectedFile)
    previewUrl.value = URL.createObjectURL(selectedFile)
  } catch {
    message.error('Image load failed!')
  } finally {
    loading.value = false
  }
}

const previewSrc = computed(() => {
  if (previewUrl.value) return previewUrl.value
  if (typeof props.modelValue === 'string') return props.modelValue
  return ''
})
</script>

<template>
  <a-upload
    list-type="picture-card"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
    class="image-uploader"
  >
    <template v-if="previewSrc">
      <a-avatar :src="previewSrc" :size="props.size" :shape="props.shape" />
    </template>

    <template v-else>
      <div class="upload-placeholder">
        <LoadingOutlined v-if="loading" />
        <PlusOutlined v-else />
        <div class="upload-label">{{ props.label }}</div>
      </div>
    </template>
  </a-upload>
</template>

<style scoped>
.image-uploader > .ant-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 128px;
  height: 128px;
  border-radius: 2px;
  overflow: hidden;
}
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}
.upload-label {
  margin-top: 6px;
  color: #666;
  font-size: 12px;
}
</style>
