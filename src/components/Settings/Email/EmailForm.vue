<script setup lang="ts">
import { reactive, ref } from 'vue'

const newEmail = reactive({
  smtp: {
    is_production: false,
    host: '',
    port: null,
    encryption: '',
    username: '',
    password: '',
    email: '',
    name: '',
  },
})

const isLoading = ref(false)

const rules = {
  host: [{ required: true, message: 'Host is required' }],
  port: [{ required: true, message: 'Port is required' }],
  encryption: [{ required: true, message: 'Encryption is required' }],
  username: [{ required: true, message: 'Username is required' }],
  password: [{ required: true, message: 'Password is required' }],
  email: [{ required: true, message: 'Email is required' }],
  name: [{ required: true, message: 'Name is required' }],
}

const onSave = () => {
  console.log('Form submitted:', newEmail.smtp)
}
</script>

<style scoped>
.w-full {
  width: 100%;
}
</style>

<template>
  <a-form
    layout="vertical"
    ref="addEmailForm"
    :model="newEmail.smtp"
    :rules="rules"
    @finish="onSave"
  >
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12">
        <a-form-item label="Is Production" name="is_production">
          <a-switch v-model:checked="newEmail.smtp.is_production" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12">
        <a-form-item label="Host" name="host" :rules="rules.host">
          <a-input v-model:value="newEmail.smtp.host" placeholder="Enter host" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12">
        <a-form-item label="Port" name="port" :rules="rules.port">
          <a-input-number
            v-model:value="newEmail.smtp.port"
            class="w-full"
            placeholder="Enter port"
          />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12">
        <a-form-item label="Encryption" name="encryption" :rules="rules.encryption">
          <a-input v-model:value="newEmail.smtp.encryption" placeholder="Enter encryption type" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12">
        <a-form-item label="Username" name="username" :rules="rules.username">
          <a-input v-model:value="newEmail.smtp.username" placeholder="Enter username" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12">
        <a-form-item label="Password" name="password" :rules="rules.password">
          <a-input-password v-model:value="newEmail.smtp.password" placeholder="Enter password" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12">
        <a-form-item label="Email" name="email" :rules="rules.email">
          <a-input v-model:value="newEmail.smtp.email" placeholder="Enter email" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :sm="12">
        <a-form-item label="Name" name="name" :rules="rules.name">
          <a-input v-model:value="newEmail.smtp.name" placeholder="Enter name" />
        </a-form-item>
      </a-col>

      <a-col :span="24" class="text-right">
        <a-button type="primary" html-type="submit" :loading="isLoading">Submit</a-button>
      </a-col>
    </a-row>
  </a-form>
</template>
