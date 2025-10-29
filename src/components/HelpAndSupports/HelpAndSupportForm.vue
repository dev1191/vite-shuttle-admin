<script setup lang="ts">
import type { HelpAndSupport, Reply } from '@/types/helpAndSupports'
const { t } = useI18n()

const emit = defineEmits(['update:visible', 'close', 'submit'])

const props = defineProps({
  visible: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  isEdit: { type: Boolean, default: false },
  item: { type: Object, required: true },
})

const formData = reactive<Reply>({
  ids: '',
  subject: '',
  message: '',
  status: 'Replied',
  type: 'notification',
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
      message: t('validation.required', { name: t('menu.helpAndSupports.form.subject') }),
      trigger: 'blur',
    },
  ],
  message: [
    {
      required: true,
      message: t('validation.required', { name: t('menu.helpAndSupports.form.message') }),
      trigger: 'blur',
    },
  ],
}

const initFormData = () => {
  const row = props.item
  Object.assign(formData, {
    ids: row?._id || '',
  })
}

const handleSubmit = (formData: Reply) => {
  emit('submit', formData)
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
    :visible="visible"
    :isEdit="isEdit"
    :formData="formData"
    :rules="rules"
    :loading="loading"
    @close="emit('update:visible', false)"
    @submit="handleSubmit"
    :submitLabel="t('common.send')"
  >
    <template #fields="{ form }">
      <a-form-item label="Send Type" name="type">
        <a-radio-group v-model:value="form.type">
          <a-radio-button value="email">{{ t('menu.helpAndSupports.sendMail') }}</a-radio-button>
          <a-radio-button value="notification">{{
            t('menu.helpAndSupports.pushNotification')
          }}</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Status" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio-button value="Open">Open</a-radio-button>
          <a-radio-button value="In Progress">In Progress</a-radio-button>
          <a-radio-button value="Replied">Replied</a-radio-button>
          <a-radio-button value="Closed">Closed</a-radio-button>
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
