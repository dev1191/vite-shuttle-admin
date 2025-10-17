<script setup lang="ts">
import type { HelpAndSupport } from '@/types/helpAndSupports'
const { t } = useI18n()

const emit = defineEmits(['close', 'submit'])

const props = defineProps({
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  item: { type: Object, required: true },
})

const formData = reactive<HelpAndSupport>({
  subject: '',
  message: '',
  type: '0',
})
const isEdit = ref(true)
const title = computed(
  () =>
    `${t('common.reply')} :- ${t('menu.helpAndSupports.form.ticketNo')}(${props.item?.ticket_no})`,
)

// ✅ Dynamic validation rules
const rules = {
  subject: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.offers.helpAndSupports.subject') }),
      trigger: 'blur',
    },
  ],
  message: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.offers.helpAndSupports.message') }),
      trigger: 'blur',
    },
  ],
}

const initFormData = () => {
  const row = props.item
  Object.assign(formData, {
    subject: row?.subject || '',
    message: row?.message || '',
    type: row?.type || '0',
    ids: row?.ids || '',
  })
}

const handleSubmit = (data: any) => {
  emit('submit', data)
}

watch(
  () => [props.visible, props.item],
  ([visible]) => {
    if (visible) initFormData()
  },
  { immediate: true },
)
</script>

<template>
  <BaseModalForm
    :title="title"
    :visible="props.visible"
    :isEdit="isEdit"
    :formData="formData"
    :rules="rules"
    :loading="loading"
    @close="$emit('close')"
    @submit="handleSubmit"
    :submitLabel="t('common.send')"
  >
    <template #fields="{ form }">
      <a-form-item label="Type" name="type">
        <a-radio-group v-model:value="form.type">
          <a-radio-button value="1">{{ t('menu.helpAndSupports.sendMail') }}</a-radio-button>
          <a-radio-button value="0">{{
            t('menu.helpAndSupports.pushNotification')
          }}</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="t('menu.helpAndSupports.form.subject')" name="subject">
        <a-input
          size="large"
          v-model:value="form.subject"
          :placeholder="
            t('validation.placeholder', { name: t('menu.helpAndSupports.form.subject') })
          "
        />
      </a-form-item>

      <a-form-item :label="t('menu.helpAndSupports.form.message')" name="message">
        <a-textarea
          :rows="5"
          size="large"
          v-model:value="form.message"
          :placeholder="
            t('validation.placeholder', { name: t('menu.helpAndSupports.form.message') })
          "
        />
      </a-form-item>
    </template>
  </BaseModalForm>
</template>
