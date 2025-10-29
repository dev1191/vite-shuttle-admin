<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'

const { t } = useI18n()
interface Props {
  item: any
  isLoading: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'submit', newGeneral: any): void
}
const emit = defineEmits<Emits>()

const newGeneral = reactive({
  name: '',
  tagline: '',
  white_logo: null,
  dark_logo: null,
  favicon: null,
  email: '',
  phone: '',
  address: '',
})

watch(
  () => props.item,
  (val) => {
    if (val) Object.assign(newGeneral, val)
  },
  { immediate: true },
)

const onSave = () => {
  emit('submit', newGeneral)
}
</script>

<template>
  <a-form ref="addGeneralForm" :model="newGeneral" layout="vertical" @finish="onSave">
    <!-- Basic Info -->
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Name is required' }]"
        >
          <a-input v-model:value="newGeneral.name" placeholder="Name" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('menu.settings.general.form.tagline')" name="tagline">
          <a-input v-model:value="newGeneral.tagline" placeholder="Tagline" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Email"
          name="email"
          :rules="[{ required: true, message: 'Email is required' }]"
        >
          <a-input v-model:value="newGeneral.email" placeholder="Email address" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Phone"
          name="phone"
          :rules="[{ required: true, message: 'Phone is required' }]"
        >
          <a-input v-model:value="newGeneral.phone" placeholder="Phone" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Address" name="address">
          <a-textarea v-model:value="newGeneral.address" :rows="3" placeholder="Address" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-divider />

    <!-- Image Uploads -->
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item :label="t('menu.settings.general.form.whiteLogo')">
          <AvatarUpload v-model="newGeneral.white_logo" shape="square" :size="80" :maxSizeMB="3" />
        </a-form-item>
      </a-col>

      <a-col :span="8">
        <a-form-item :label="t('menu.settings.general.form.darkLogo')">
          <AvatarUpload v-model="newGeneral.dark_logo" shape="square" :size="80" :maxSizeMB="3" />
        </a-form-item>
      </a-col>

      <a-col :span="8">
        <a-form-item :label="t('menu.settings.general.form.favicon')">
          <AvatarUpload v-model="newGeneral.favicon" shape="square" :size="80" :maxSizeMB="3" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-divider />

    <!-- Submit -->
    <a-form-item style="text-align: right; margin-top: 16px">
      <a-button size="large" type="primary" :loading="props.isLoading" html-type="submit"
        >Submit</a-button
      >
    </a-form-item>
  </a-form>
</template>
