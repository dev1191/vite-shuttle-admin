<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.store'
import type { Role } from '@/types/roles'
import { message, type FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

interface Props {
  visible: boolean
  isLoading: boolean
  type: string
  roleData?: Role
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', formData: Role): void
}

const { t } = useI18n()

const { permissions } = useUserStore()
const formRef = ref()

const formData = reactive<Role>({
  ids: '',
  name: '',
  slug: '',
  permissions: [
    {
      _id: '',
      name: '',
      slug: '',
    },
  ],
})

watch(
  () => formData.name,
  (newName) => {
    formData.slug = newName.trim().toLowerCase().replace(/\s+/g, '-')
  },
)

const rules: Record<string, Rule[]> = {
  name: [
    {
      required: true,
      message: t('validation.required', { name: t('manageUsers.roles.form.name') }),
      trigger: 'blur',
    },
    {
      min: 2,
      max: 20,
      message: t('validation.lengthBetween', { min: 2, max: 20 }),
      trigger: 'blur',
    },
  ],
}

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const title = computed(() =>
  props.type === 'add'
    ? t('common.create', { name: t('manageUsers.role.newRole') })
    : t('common.edit'),
)

const initFormData = () => {
  const isEdit = props.type === 'edit' && props.roleData
  const row = props.roleData

  Object.assign(formData, {
    ids: isEdit ? row?.ids || '' : '',
    name: isEdit ? row.name || '' : '',
    slug: isEdit ? row.slug || '' : '',
    permissions: isEdit ? row.permissions || [] : [],
  })
}

// Permissions handling
const searchPermission = ref('')
const allPermissions = ref<{ _id: string; name: string; slug: string }[]>([...permissions])

const filteredPermissions = computed(() => {
  if (!searchPermission.value) return allPermissions.value
  return allPermissions.value.filter((perm) =>
    perm.slug.includes(searchPermission.value.toLowerCase()),
  )
})

// Select / Deselect All Permissions
const toggleAll = ref(false)
const toggleButtonText = computed(() =>
  toggleAll.value ? t('common.unselectAll') : t('common.selectAll'),
)

const toggleAllPermissions = () => {
  toggleAll.value = !toggleAll.value
  formData.permissions = toggleAll.value
    ? allPermissions.value.map((perm) => ({ _id: perm._id, name: perm.name, slug: perm.slug }))
    : []
}

watch(
  () => [props.visible, props.type, props.roleData],
  ([visible, type]) => {
    if (visible) {
      initFormData()
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      emit('submit', toRaw(formData))
    })
    .catch((error) => {
      console.log('error', error)
      message.error('errpr', error)
    })
}
</script>

<template>
  <a-modal
    style="top: 20px"
    v-model:open="dialogVisible"
    :title="title"
    width="80%"
    :maskClosable="false"
  >
    <AForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      :labelCol="{ span: 12 }"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item :label="t('manageUsers.roles.form.name')" name="name">
            <a-input
              v-model:value="formData.name"
              size="large"
              :placeholder="t('validation.placeholder', { name: t('manageUsers.roles.form.name') })"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item :label="t('manageUsers.roles.form.slug')" name="slug">
            <a-input
              v-model:value="formData.slug"
              readonly
              size="large"
              :placeholder="t('validation.placeholder', { name: t('manageUsers.roles.form.slug') })"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- Permissions Section -->
      <a-divider orientation="left">
        {{ t('manageUsers.roles.form.permissions') }}
      </a-divider>

      <div class="flex flex-col sm:flex-row gap-4 w-full mb-4">
        <!-- Search Input -->
        <a-input-search
          size="large"
          v-model:value="searchPermission"
          :placeholder="
            t('common.search', { name: t('manageUsers.roles.permission').toLowerCase() })
          "
          class="w-full sm:w-1/2"
          allow-clear
        />

        <!-- Toggle All Button -->
        <a-button
          size="large"
          @click="toggleAllPermissions"
          class="sm:ml-auto flex items-center justify-center gap-2"
        >
          <template #icon>
            <Icon name="hugeicons:checkmark-square-01" :size="5" />
          </template>
          {{ toggleButtonText }}
        </a-button>
      </div>

      <!-- Permissions Grid -->
      <a-row :gutter="[16, 16]" class="permission-grid">
        <a-col
          v-for="permission in filteredPermissions"
          :key="permission._id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <a-checkbox
            :checked="formData.permissions.some((p) => p.slug === permission.slug)"
            :value="permission.slug"
          >
            {{ permission.name }}
          </a-checkbox>
        </a-col>
      </a-row>
    </AForm>
    <template #footer>
      <div class="dialog-footer">
        <AButton size="large" @click="dialogVisible = false">{{ t('common.cancel') }}</AButton>
        <AButton size="large" type="primary" @click="handleSubmit" :loading="isLoading">{{
          type == 'add'
            ? t('common.create', { name: t('manageUsers.roles.role') })
            : t('common.update', { name: t('manageUsers.roles.role') })
        }}</AButton>
      </div>
    </template>
  </a-modal>
</template>

<style scoped></style>
