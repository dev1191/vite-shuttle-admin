<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface Props {
  modelValue?: File | null // ✅ now stores File instead of base64
  size?: number // avatar size
  maxSizeMB?: number // file size limit
}

interface Emits {
  (e: 'update:modelValue', value: File | null): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 120,
  maxSizeMB: 2,
})
const emit = defineEmits<Emits>()

const loading = ref(false)

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

// Convert file to base64 (⚠️ keeping old logic for preview, commented if not needed)
/*
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
*/

const previewUrl = ref<string>('')

const handleChange = async ({ file }: any) => {
  if (!file || !file.originFileObj) return
  loading.value = true
  try {
    const selectedFile = file.originFileObj as File

    // ✅ emit File instead of base64
    emit('update:modelValue', selectedFile)

    // generate preview (without base64 upload)
    previewUrl.value = URL.createObjectURL(selectedFile)

    // ⚠️ old base64 logic (commented out)
    // const base64 = await toBase64(selectedFile)
    // emit('update:modelValue', base64)
  } catch (e) {
    message.error('Failed to load image!')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <a-upload
    list-type="picture-card"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
    class="avatar-uploader"
  >
    <div v-if="props.modelValue || previewUrl">
      <a-avatar :src="previewUrl" :size="props.size" />
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
