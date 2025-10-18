<script setup lang="ts">
interface Props {
  item: any
  isLoading: boolean
}
const props = defineProps<Props>()
interface Emits {
  (e: 'submit', newEmail: any): void
}
const emit = defineEmits<Emits>()
const doShowTestModal = ref(false)
const { t } = useI18n()
const newEmail = reactive({
  is_production: false,
  type: 'SMTP',
  key: '',
  host: '',
  port: null,
  encryption: '',
  username: '',
  password: '',
  email: '',
  name: '',
})

watch(
  () => props.item,
  (val) => {
    if (val) Object.assign(newEmail, val)
  },
  { immediate: true },
)

const rules = computed(() => {
  const baseRules = {
    host: [{ required: true, message: 'Host is required' }],
    port: [{ required: true, message: 'Port is required' }],
    encryption: [{ required: true, message: 'Encryption is required' }],
    username: [{ required: true, message: 'Username is required' }],
    password: [{ required: true, message: 'Password is required' }],
    email: [{ required: true, message: 'Email is required' }],
    name: [{ required: true, message: 'Name is required' }],
  }

  // Only add API key rule if type is RESEND
  if (newEmail.type === 'RESEND') {
    return { ...baseRules, key: [{ required: true, message: 'API Key is required' }] }
  }

  return baseRules
})

const onSave = async () => {
  console.log('Form submitted:', newEmail)
  emit('submit', newEmail)
}

const handleSendMail = async () => {
  doShowTestModal.value = false
}
</script>

<template>
  <a-form layout="vertical" ref="addEmailForm" :model="newEmail" :rules="rules" @finish="onSave">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12">
        <a-form-item :label="t('menu.settings.emails.form.toProduction')" name="is_production">
          <a-switch v-model:checked="newEmail.is_production" />
        </a-form-item>
      </a-col>

      <a-col :xs="24" :sm="12">
        <a-form-item :label="t('menu.settings.emails.form.defaultType')" name="type">
          <a-radio-group v-model:value="newEmail.type">
            <a-radio-button value="SMTP">SMTP</a-radio-button>
            <a-radio-button value="RESEND">RESEND</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>

      <!-- ✅ Show only if type is RESEND -->
      <a-col v-if="newEmail.type === 'RESEND'" :xs="24" :sm="12">
        <a-form-item :label="t('menu.settings.emails.form.apiKey')" name="key" :rules="rules.key">
          <a-input size="large" v-model:value="newEmail.key" placeholder="Enter API Key" />
        </a-form-item>
      </a-col>

      <!-- SMTP fields -->
      <template v-if="newEmail.type === 'SMTP'">
        <a-col :xs="24" :sm="12">
          <a-form-item :label="t('menu.settings.emails.form.host')" name="host" :rules="rules.host">
            <a-input size="large" v-model:value="newEmail.host" placeholder="Enter host" />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="12">
          <a-form-item :label="t('menu.settings.emails.form.port')" name="port" :rules="rules.port">
            <a-input-number
              size="large"
              v-model:value="newEmail.port"
              class="w-full"
              placeholder="Enter port"
            />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="12">
          <a-form-item
            :label="t('menu.settings.emails.form.encryption')"
            name="encryption"
            :rules="rules.encryption"
          >
            <a-input
              size="large"
              v-model:value="newEmail.encryption"
              placeholder="Enter encryption"
            />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="12">
          <a-form-item
            :label="t('menu.settings.emails.form.username')"
            name="username"
            :rules="rules.username"
          >
            <a-input size="large" v-model:value="newEmail.username" placeholder="Enter username" />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="12">
          <a-form-item
            :label="t('menu.settings.emails.form.password')"
            name="password"
            :rules="rules.password"
          >
            <a-input-password
              size="large"
              v-model:value="newEmail.password"
              placeholder="Enter password"
            />
          </a-form-item>
        </a-col>
      </template>

      <a-col :xs="24" :sm="12">
        <a-form-item
          :label="t('menu.settings.emails.form.email')"
          name="email"
          :rules="rules.email"
        >
          <a-input size="large" v-model:value="newEmail.email" placeholder="Enter email" />
        </a-form-item>
      </a-col>

      <a-col :xs="24" :sm="12">
        <a-form-item :label="t('menu.settings.emails.form.name')" name="name" :rules="rules.name">
          <a-input size="large" v-model:value="newEmail.name" placeholder="Enter name" />
        </a-form-item>
      </a-col>

      <a-col :span="24" class="flex flex-row gap-2 justify-end">
        <a-button size="large" dash @click="doShowTestModal = true">{{
          t('menu.settings.emails.sendTestMail')
        }}</a-button>
        <a-button size="large" type="primary" html-type="submit" :loading="props.isLoading">{{
          t('common.submit')
        }}</a-button>
      </a-col>
    </a-row>
  </a-form>

  <TestMail :visible="doShowTestModal" @close="doShowTestModal = false" @submit="handleSendMail" />
</template>
