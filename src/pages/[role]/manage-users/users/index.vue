<script setup lang="ts">
import type {
  DataTableRecord,
  DataTableColumn,
  TableChangeEvent,
  PaginationData,
} from '@/components/Shared/DataTable.vue'
import { useUsers } from '@/composables/modules/useUsers'
import type { User } from '@/types/users'
import { Space } from 'ant-design-vue'

import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useUserStore } from '@/stores/modules/user.store'

const { users, pagination, isLoading, fetchUsers, addUser, editUser, removeUser } = useUsers()

const { t } = useI18n()
const { renderUserAvatar, renderTag, renderActionButton, renderDeleteActionButton, useRenderIcon } =
  useRender()

const userStore = useUserStore()
const userInfo = computed(() => userStore.user)
const statusFilter = ref<string>('')
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<User[]>([])
const selectedRow = ref<User>({})
const dialogVisible = ref<boolean>(false)
const dialogType = ref('add')

const columns: DataTableColumn[] = [
  {
    title: 'FullName',
    dataIndex: 'fullname',
    key: 'fullname', // Fixed: key should match dataIndex
    sorter: true,
    customRender: ({ record }) => {
      return renderUserAvatar(
        record.picture,
        record.fullname,
        `${record.country_code} ${record.phone}`,
      )
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: true,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    sorter: true,
  },
  {
    title: 'Status',
    dataIndex: 'is_active',
    key: 'is_active',
    customRender: ({ record }) => {
      const StatusEnum = {
        true: 'active',
        false: 'inactive',
      } as const

      const statusColorMap: Record<string, string> = {
        false: 'red',
        true: 'success',
      }

      const upperText = record.is_active as keyof typeof StatusEnum
      const color = statusColorMap[upperText] || 'default'
      return renderTag(StatusEnum[upperText], color, 'status')
    },
  },
  {
    title: 'Action',
    fixed: 'right',
    key: 'action',
    width: 100,
    customRender: ({ record }) =>
      h(
        Space,
        { direction: 'horizontal', size: 'middle' }, // horizontal spacing
        {
          default: () => [
            renderActionButton('hugeicons:pencil-edit-02', t('common.edit'), () =>
              handleEditUser(record),
            ),
            userInfo.value?.id !== record.ids
              ? renderDeleteActionButton(
                  t('common.delete', { name: record.fullname }),
                  t('common.confirmMessage', { name: record.fullname }),
                  () => handleDeleteUser(record),
                )
              : null,
          ],
        },
      ),
  },
]

// Row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: User[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  },
  onSelect: (record: User, selected: boolean) => {
    console.log('Selected:', record, selected)
  },
  onSelectAll: (selected: boolean, rows: User[], changeRows: User[]) => {
    console.log('Select all:', selected, rows, changeRows)
  },
}))

// Convert PaginatingParams to DataTable PaginationData format
const tablesPagination = computed<PaginationData>(() => ({
  page: pagination.value.page,
  itemsPerPage: pagination.value.itemsPerPage,
  globalSearch: pagination.value.globalSearch,
  sortBy: pagination.value.sortBy,
  sortDesc: pagination.value.sortDesc,
  range: pagination.value.range,
  totalRecords: pagination.value.totalRecords || 0,
}))

const handleStatusFilter = (): void => {
  // Reset to first page when filtering
  pagination.value.page = 1
  // Add status filter to your pagination or handle separately
  console.log('Status filter:', statusFilter.value)
  pagination.value.filters = {
    type: 'simple',
    name: typeof statusFilter.value == 'undefined' ? '' : 'is_active',
    value:
      typeof statusFilter.value == 'undefined' ? '' : statusFilter.value == 'active' ? true : false,
  }
  // The composable will automatically fetch due to watch on pagination
}

const handleTableChange = (event: TableChangeEvent): void => {
  // Update pagination based on table changes
  pagination.value.page = event.pagination.current
  pagination.value.itemsPerPage = event.pagination.pageSize

  // Handle sorting
  if (event.sorter.field) {
    pagination.value.sortBy = event.sorter.field
    pagination.value.sortDesc = event.sorter.order === 'ascend' ? 'asc' : 'desc'
  }
}

const handleSearch = (value: string): void => {
  // Update pagination with search term
  pagination.value.page = 1 // Reset to first page on search
  pagination.value.globalSearch = value

  // The composable watch will automatically trigger fetchUsers
}

// Handle pagination changes from DataTable
const handlePaginationChange = (newPagination: PaginationData): void => {
  // Update composable pagination
  pagination.value.page = newPagination.page
  pagination.value.itemsPerPage = newPagination.itemsPerPage
  pagination.value.globalSearch = newPagination.globalSearch
  pagination.value.sortBy = newPagination.sortBy
  pagination.value.sortDesc = newPagination.sortDesc
  pagination.value.range = newPagination.range

  // The composable watch will automatically trigger fetchUsers
}

const showDialog = async (): void => {
  // Add user logic - you might want to open a modal/form
  dialogVisible.value = true
  selectedRow.value = {}
}

const handleDialogSubmit = async (formData: User) => {
  try {
    isLoading.value = true
    if (dialogType.value === 'add') {
      // ✅ Create new user
      await addUser(formData)
      message.success(t('common.createMessage', { name: formData.fullname }))
    } else if (dialogType.value === 'edit') {
      // ✅ Update existing user
      if (!formData?.ids) {
        message.error(t('common.noUserSelected'))
        return
      }
      await editUser(formData.ids, formData)
      message.success(
        t('common.updateMessage', { title: t('manageUsers.users.user'), name: formData.fullname }),
      )
    }

    // ✅ Close dialog + refresh table
    dialogVisible.value = false
    isLoading.value = false
    await fetchUsers()
    formData.value = {}
  } catch (error: any) {
    console.error('Submit failed:', error)
    message.error(error.message || t('common.submitFailed'))
    isLoading.value = false
  }
}

const handleEditUser = async (user: User): void => {
  selectedRow.value = user
  dialogVisible.value = true
  dialogType.value = 'edit'
}

const handleDeleteUser = async (user: User): void => {
  try {
    await removeUser(user.ids)
    await fetchUsers() // ✅ Refresh table after deletion
    message.success(t('common.deleteMessage', { name: user.fullname }))
  } catch (error: any) {
    //console.error('Failed to delete user:', error)
    message.error(`${t('common.deleteFailed')} ${error.message || ''}`)
  }
}
</script>

<template>
  <div>
    <DataTable
      title="Users Management"
      :data="users"
      :columns="columns"
      :loading="isLoading"
      :pagination="tablesPagination"
      searchable
      remote
      dateRange
      search-placeholder="Search users..."
      :row-selection="rowSelection"
      @change="handleTableChange"
      @search="handleSearch"
      @pagination-change="handlePaginationChange"
    >
      <!-- Custom action buttons in header -->
      <template #headerActions>
        <a-button size="large" type="primary" @click="showDialog">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ t('common.create', { name: t('manageUsers.users.newUser') }) }}
        </a-button>
      </template>

      <!-- Custom filters -->
      <template #filters>
        <a-select
          size="large"
          v-model:value="statusFilter"
          placeholder="Filter by status"
          style="min-width: 150px"
          @change="handleStatusFilter"
          allow-clear
        >
          <a-select-option value="active">{{ t('common.active') }}</a-select-option>
          <a-select-option value="inactive">{{ t('common.inactive') }}</a-select-option>
        </a-select>
      </template>

      <!-- Action buttons -->
      <!-- <template #action="{ record }">
        <a-space>
          <a-tooltip :title="t('common.edit')">
            <a-button size="small" type="link" @click="handleEditUser(record)">
              <template #icon>
                <Icon name="hugeicons:pencil-edit-02" :size="5" />
              </template>
            </a-button>
          </a-tooltip>
          <a-tooltip :title="t('common.delete')">
            <a-button size="small" type="link" danger @click="handleDeleteUser(record)">
              <template #icon>
                <Icon name="hugeicons:delete-02" :size="5" />
              </template>
            </a-button>
          </a-tooltip>
        </a-space>
      </template> -->
    </DataTable>

    <AdminUserDialog
      v-model:visible="dialogVisible"
      :isLoading="isLoading"
      :type="dialogType"
      :user-data="selectedRow"
      @submit="handleDialogSubmit"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageUsers.users
  icon: UsergroupOutlined
  drawerIndex: 0
  order: 3
  roles: [admin, agent, staff, manager]
  hidden: false
  breadcrumb:
    - manageUsers.title
    - manageUsers.users
</route>

<style scoped>
/* Add any custom styles here */
</style>
