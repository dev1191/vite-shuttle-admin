<script setup lang="ts">
const { t } = useI18n()
const props = defineProps({
  modelValue: { type: Object, required: true },
  isLoading: { type: Boolean, default: false },
  isEditable: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'prev', 'submit'])

const handlePrev = () => emit('prev')
const handleSubmit = () => emit('submit')
</script>

<template>
  <a-form layout="vertical">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item
          :label="t('menu.manageOperators.form.registrationCertificate')"
          name="registration_certificate"
        >
          <document-upload
            v-model="modelValue.registration_certificate"
            :initial-url="modelValue.registration_certificate_url"
            accept="image/*"
            :uploadText="
              t('menu.manageOperators.form.uploadDocument', {
                name: t('menu.manageOperators.form.registrationCertificate'),
              })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('menu.manageOperators.form.gstCertificate')" name="gst_certificate">
          <document-upload
            v-model="modelValue.gst_certificate"
            :initial-url="modelValue.gst_certificate_url"
            accept="image/*"
            :uploadText="
              t('menu.manageOperators.form.uploadDocument', {
                name: t('menu.manageOperators.form.gstCertificate'),
              })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :label="t('menu.manageOperators.form.taxDocument')" name="tax_document">
          <document-upload
            v-model="modelValue.tax_document"
            :initial-url="modelValue.tax_document_url"
            accept="image/*"
            :uploadText="
              t('menu.manageOperators.form.uploadDocument', {
                name: t('menu.manageOperators.form.taxDocument'),
              })
            "
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :label="t('menu.manageOperators.form.transportPermit')"
          name="transport_permit"
        >
          <document-upload
            v-model="modelValue.transport_permit"
            :initial-url="modelValue.transport_permit_url"
            accept="image/*"
            :uploadText="
              t('menu.manageOperators.form.uploadDocument', {
                name: t('menu.manageOperators.form.transportPermit'),
              })
            "
          />
        </a-form-item>
      </a-col>
    </a-row>

    <div class="flex justify-between mt-4">
      <a-button size="large" @click="handlePrev">{{ t('common.previous') }}</a-button>
      <a-button size="large" type="primary" :loading="props.isLoading" @click="handleSubmit">{{
        t('common.submit')
      }}</a-button>
    </div>
  </a-form>
</template>
