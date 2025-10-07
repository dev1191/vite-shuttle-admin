<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Props {
  modelValue?: File | string | null // ✅ support File or URL
  size?: number // avatar size
  maxSizeMB?: number // file size limit
}

interface Emits {
  (e: 'update:modelValue', value: File | string | null): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
  maxSizeMB: 2,
})

const emit = defineEmits<Emits>()

const loading = ref(false)
const previewUrl = ref<string>('') // only for newly selected File

// Validation before upload
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('You can only upload image files!')
    return false
  }
  const isLt = file.size / 1024 / 1024 < props.maxSizeMB
  if (!isLt) {
    message.error(`Image must be smaller than ${props.maxSizeMB}MB!`)
    return false
  }
  return true
}

// Handle file selection
const handleChange = async ({ file }: any) => {
  if (!file || !file.originFileObj) return
  loading.value = true
  try {
    const selectedFile = file.originFileObj as File

    // ✅ emit File to parent
    emit('update:modelValue', selectedFile)

    // Create preview for UI
    previewUrl.value = URL.createObjectURL(selectedFile)
  } catch (e) {
    message.error('Failed to load image!')
  } finally {
    loading.value = false
  }
}

// Compute preview source: new file preview > URL from modelValue
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
    class="avatar-uploader"
  >
    <div v-if="previewSrc">
      <a-avatar :src="previewSrc" :size="props.size" />
    </div>
    <div v-else>
      <PlusOutlined />
      <div>Upload</div>
    </div>
  </a-upload>
</template>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
