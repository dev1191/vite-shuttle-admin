<script setup lang="ts">
const { t } = useI18n()
const props = defineProps({
  modelValue: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue', 'prev', 'submit'])

const handlePrev = () => emit('prev')
const handleSubmit = () => emit('submit')
</script>

<template>
  <a-form layout="vertical">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item :label="t('menu.manageDrivers.form.avatar')" name="avatar">
          <AvatarUpload v-model="modelValue.picture" :size="100" :maxSizeMB="3" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('menu.manageDrivers.form.drivingLicence')" name="licenseFile">
          <document-upload
            v-model="modelValue.document_licence"
            :initial-url="modelValue.document_licence_url"
            accept="image/*"
            :uploadText="
              t('menu.manageDrivers.form.uploadDocument', {
                name: t('menu.manageDrivers.form.drivingLicence'),
              })
            "
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item
          :label="t('menu.manageDrivers.form.nationalIcard')"
          name="document_national_icard"
        >
          <document-upload
            v-model="modelValue.document_national_icard"
            :initial-url="modelValue.document_national_icard_url"
            accept="image/*"
            :uploadText="
              t('menu.manageDrivers.form.uploadDocument', {
                name: t('menu.manageDrivers.form.nationalIcard'),
              })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :label="t('menu.manageDrivers.form.policeVertification')"
          name="document_police_vertification"
        >
          <document-upload
            v-model="modelValue.document_police_vertification"
            :initial-url="modelValue.document_police_vertification_url"
            accept="image/*"
            :uploadText="
              t('menu.manageDrivers.form.uploadDocument', {
                name: t('menu.manageDrivers.form.policeVertification'),
              })
            "
          />
        </a-form-item>
      </a-col>
    </a-row>

    <div class="flex justify-between mt-4">
      <a-button size="large" @click="handlePrev">Previous</a-button>
      <a-button size="large" type="primary" @click="handleSubmit">Submit</a-button>
    </div>
  </a-form>
</template>
