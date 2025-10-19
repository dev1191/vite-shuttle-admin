<script setup lang="ts">
const { t } = useI18n()

const emit = defineEmits(['close', 'submit'])

const props = defineProps({
  visible: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const rules = {
  email: [{ required: true, message: 'Please enter email address', trigger: 'blur' }],
}
const formData = reactive({
  email: '',
})

const handleSubmit = (data: any) => {
  emit('submit', data)
}
</script>

<template>
  <BaseModalForm
    :title="t('menu.settings.emails.sendTestMail')"
    :visible="visible"
    :isEdit="isEdit"
    :formData="formData"
    :rules="rules"
    :loading="loading"
    @close="$emit('close')"
    @submit="handleSubmit"
    :description="t('menu.settings.emails.description')"
    :submitLabel="t('common.send')"
  >
    <template #fields="{ form }">
      <a-form-item :label="t('menu.settings.emails.email')" name="email">
        <a-input size="large" v-model:value="form.email" placeholder="Enter email address" />
      </a-form-item>
    </template>
  </BaseModalForm>
</template>

<style scoped></style>
