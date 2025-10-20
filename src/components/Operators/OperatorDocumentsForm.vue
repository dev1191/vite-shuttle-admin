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
      <a-col :span="8">
        <a-form-item
          :label="t('menu.manageOperators.form.registrationCertificate')"
          name="registration_certificate"
        >
          <a-upload
            v-model:file-list="modelValue.registration_certificate"
            list-type="picture"
            :multiple="false"
            :max-count="1"
            :before-upload="() => false"
          >
            <a-button>{{
              t('menu.manageOperators.form.uploadDocument', {
                name: t('menu.manageOperators.form.registrationCertificate'),
              })
            }}</a-button>
          </a-upload>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item :label="t('menu.manageOperators.form.panCard')" name="pan_cad">
          <a-upload
            v-model:file-list="modelValue.pan_cad"
            list-type="picture"
            :multiple="false"
            :max-count="1"
            :before-upload="() => false"
          >
            <a-button>{{
              t('menu.manageOperators.form.uploadDocument', {
                name: t('menu.manageOperators.form.panCard'),
              })
            }}</a-button>
          </a-upload>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          :label="t('menu.manageOperators.form.transportPermit')"
          name="transport_permit"
        >
          <a-upload
            v-model:file-list="modelValue.transport_permit"
            list-type="picture"
            :multiple="false"
            :max-count="1"
            :before-upload="() => false"
          >
            <a-button>{{
              t('menu.manageOperators.form.uploadDocument', {
                name: t('menu.manageOperators.form.transportPermit'),
              })
            }}</a-button>
          </a-upload>
        </a-form-item>
      </a-col>
    </a-row>

    <div class="flex justify-between mt-4">
      <a-button size="large" @click="handlePrev">Previous</a-button>
      <a-button size="large" type="primary" @click="handleSubmit">Submit</a-button>
    </div>
  </a-form>
</template>
