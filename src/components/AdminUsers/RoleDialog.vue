<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user.store'
import type { AllPermissions, Role } from '@/types/roles'
import { message, type FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { reactive, ref, computed, watch, nextTick, toRaw } from 'vue'

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
const { permissions } = useUserStore() // permissions grouped by module
const formRef = ref<FormInstance>()

const formData = reactive<Role>({
  ids: '',
  name: '',
  slug: '',
  permissions: [], // stores selected permission objects
})

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const title = computed(() =>
  props.type === 'add'
    ? t('common.create', { name: t('manageUsers.role.newRole') })
    : t('common.edit'),
)

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

const initFormData = () => {
  const isEdit = props.type === 'edit' && props.roleData
  const row = props.roleData
  Object.assign(formData, {
    ids: isEdit ? row?.ids || '' : '',
    name: isEdit ? row.name || '' : '',
    slug: isEdit ? row.slug || '' : '',
    permissions: isEdit ? row.permissions || [] : [],
  })

  // Initialize selectedPermissionsByModule for edit
  allPermissions.value.forEach((group) => {
    selectedPermissionsByModule[group.module] = formData.permissions
      .filter((p) => group.permissions.some((gp) => gp.slug === p.slug))
      .map((p) => p.slug)
  })

  updatePermissionStates()
}

// Permission search
const searchPermission = ref('')
const allPermissions = ref<AllPermissions[]>(permissions) // grouped by module

const filteredPermissions = computed(() => {
  if (!searchPermission.value) return allPermissions.value
  return allPermissions.value
    .map((group) => ({
      ...group,
      permissions: group.permissions.filter((p) =>
        p.slug.includes(searchPermission.value.toLowerCase()),
      ),
    }))
    .filter((group) => group.permissions.length)
})

// Track selected permissions **per module**
const selectedPermissionsByModule = reactive<Record<string, string[]>>({})
allPermissions.value.forEach((group) => {
  selectedPermissionsByModule[group.module] = []
})

// Update formData.permissions based on selectedPermissionsByModule
const updateFormPermissions = () => {
  const allSelected = Object.values(selectedPermissionsByModule).flat()
  const allPermsFlat = allPermissions.value.flatMap((g) => g.permissions)
  formData.permissions = allPermsFlat.filter((p) => allSelected.includes(p.slug))
  updatePermissionStates()
}

// Check All / Indeterminate state
const permissionState = reactive({
  checkAll: false, // global select all
  indeterminate: false,
  moduleStates: {} as Record<string, { checkAll: boolean; indeterminate: boolean }>,
})

// Initialize moduleStates
allPermissions.value.forEach((group) => {
  permissionState.moduleStates[group.module] = { checkAll: false, indeterminate: false }
})

// Update module and global check states
const updatePermissionStates = () => {
  // Per module
  allPermissions.value.forEach((group) => {
    const selected = selectedPermissionsByModule[group.module] || []
    const total = group.permissions.length
    permissionState.moduleStates[group.module].checkAll = selected.length === total
    permissionState.moduleStates[group.module].indeterminate =
      selected.length > 0 && selected.length < total
  })

  // Global
  const totalPermissions = allPermissions.value.flatMap((g) => g.permissions).length
  permissionState.checkAll = formData.permissions.length === totalPermissions
  permissionState.indeterminate =
    formData.permissions.length > 0 && formData.permissions.length < totalPermissions
}

// Module Select All
const onModuleCheckAllChange = (module: string, e: any) => {
  const group = allPermissions.value.find((g) => g.module === module)
  if (!group) return
  selectedPermissionsByModule[module] = e.target.checked ? group.permissions.map((p) => p.slug) : []
  updateFormPermissions()
}

// Global Select All
const onCheckAllChange = (e: any) => {
  if (e.target.checked) {
    allPermissions.value.forEach((g) => {
      selectedPermissionsByModule[g.module] = g.permissions.map((p) => p.slug)
    })
  } else {
    allPermissions.value.forEach((g) => {
      selectedPermissionsByModule[g.module] = []
    })
  }
  updateFormPermissions()
}

watch(
  () => [props.visible, props.type, props.roleData],
  ([visible]) => {
    if (visible) {
      initFormData()
      nextTick(() => formRef.value?.clearValidate())
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  formRef.value
    ?.validate()
    .then(() => emit('submit', toRaw(formData)))
    .catch((err) => message.error('Error: ' + err))
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
    <a-form
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
      <a-divider orientation="left">{{ t('manageUsers.roles.form.permissions') }}</a-divider>

      <div class="flex flex-col sm:flex-row gap-4 w-full mb-2">
        <a-input-search
          size="large"
          v-model:value="searchPermission"
          :placeholder="
            t('common.search', { name: t('manageUsers.roles.permission').toLowerCase() })
          "
          class="w-full sm:w-1/2"
          allow-clear
        />

        <a-checkbox
          size="large"
          v-model:checked="permissionState.checkAll"
          :indeterminate="permissionState.indeterminate"
          @change="onCheckAllChange"
          class="sm:ml-auto flex"
        >
          {{ t('common.selectAll') }}
        </a-checkbox>
      </div>

      <!-- Grouped Permissions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="group in filteredPermissions" :key="group.module" class="border rounded p-4">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium">{{ group.module }}</h3>
          </div>
          <a-checkbox-group
            v-model:value="selectedPermissionsByModule[group.module]"
            :options="group.permissions.map((p) => ({ label: p.name, value: p.slug }))"
            class="flex flex-col gap-2"
            @change="updateFormPermissions"
          />
        </div>
      </div>
    </a-form>

    <template #footer>
      <div class="dialog-footer">
        <a-button size="large" @click="dialogVisible = false">{{ t('common.cancel') }}</a-button>
        <a-button size="large" type="primary" @click="handleSubmit" :loading="isLoading">
          {{
            props.type === 'add'
              ? t('common.create', { name: t('manageUsers.roles.role') })
              : t('common.update', { name: t('manageUsers.roles.role') })
          }}
        </a-button>
      </div>
    </template>
  </a-modal>
</template>
