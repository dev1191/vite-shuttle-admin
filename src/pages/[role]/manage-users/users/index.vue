<script setup lang="ts">
import type {
  DataTableColumn,
  DataTableRecord,
  TableChangeEvent,
  PaginationData,
} from '@/components/Shared/DataTable.vue'
import { useUsers } from '@/composables/modules/useUsers'
import type { User } from '@/types/users'
import type { PaginatingParams } from '@/types'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

const { users, pagination, isLoading, fetchUsers, addUser, editUser, removeUser } = useUsers()

const { t } = useI18n()
const columns: DataTableColumn[] = [
  {
    title: 'FullName',
    dataIndex: 'fullname',
    key: 'fullname', // Fixed: key should match dataIndex
    sorter: true,
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
    scopedSlots: true, // This enables the slot
  },
  {
    title: 'Action',
    fixed: 'right',
    key: 'action',
    width: 100,
  },
]

const statusFilter = ref<string>('')
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<User[]>([])
const selectedRow = ref<User>({})
const dialogVisible = ref<boolean>(false)
const dialogType = ref('add')
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

  // The composable watch will automatically trigger fetchUsers
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

const handleDialogSubmit = async () => {
  try {
    if (dialogType.value === 'add') {
      // ✅ Create new user
      await addUser(selectedRow.value)
      message.success(t('common.createMessage', { name: selectedRow.value.fullname }))
    } else if (dialogType.value === 'edit') {
      // ✅ Update existing user
      if (!selectedRow.value?.id) {
        message.error(t('common.noUserSelected'))
        return
      }
      await editUser(selectedRow.value.id, selectedRow.value)
      message.success(t('common.updateMessage', { name: selectedRow.value.fullname }))
    }

    // ✅ Close dialog + refresh table
    dialogVisible.value = false
    await fetchUsers()
    selectedRow.value = {}
  } catch (error: any) {
    console.error('Submit failed:', error)
    message.error(error.message || t('common.submitFailed'))
  }
}

const handleEditUser = async (user: User): void => {
  selectedRow.value = user
  dialogVisible.value = true
  dialogType.value = 'edit'
  // Add edit logic - open modal/form with user data
  // Example:
  // const updates = { name: 'Updated Name' }
  // await editUser(user.id, updates)
}

const handleDeleteUser = async (user: User): void => {
  // Add confirmation dialog
  Modal.confirm({
    icon: h(ExclamationCircleOutlined),
    title: t('common.delete', { name: t('manageUsers.users.user') }),
    centered: true,
    content: t('common.confirmMessage', { name: user.fullname }),
    okText: t('common.delete'),
    okType: 'danger',
    async onOk() {
      try {
        await removeUser(user.ids)
        await fetchUsers() // ✅ Refresh table after deletion
        message.success(t('common.deleteMessage', { name: user.fullname }))
      } catch (error: any) {
        //console.error('Failed to delete user:', error)
        message.error(`${t('common.deleteFailed')} ${error.message || ''}`)
      }
    },
    onCancel() {
      message.info(t('common.cancelDelete', { name: user.fullname }))
    },
  })
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

      <!-- Custom column rendering for status -->
      <template #is_active="{ text, record }">
        <a-tag :color="text === 'active' || text === true || text === 1 ? 'green' : 'red'">
          {{
            typeof text === 'boolean'
              ? text
                ? 'ACTIVE'
                : 'INACTIVE'
              : typeof text === 'number'
                ? text === 1
                  ? 'ACTIVE'
                  : 'INACTIVE'
                : text.toString().toUpperCase()
          }}
        </a-tag>
      </template>

      <!-- Action buttons -->
      <template #action="{ record }">
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
      </template>
    </DataTable>

    <AdminUserDialog
      v-model:visible="dialogVisible"
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
