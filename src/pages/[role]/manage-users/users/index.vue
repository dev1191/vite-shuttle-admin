<script setup lang="ts">
import { UserService } from '@/common/api/user'
import type {
  DataTableColumn,
  DataTableRecord,
  TableChangeEvent,
} from '@/components/Shared/DataTable.vue'
import { useUsers } from '@/composables/users/useUsers'

const { fetchUsers, users, isLoading } = useUsers()

interface User extends DataTableRecord {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
}

const loading = ref<boolean>(false)

const columns: DataTableColumn[] = [
  {
    title: 'FullName',
    dataIndex: 'fullname',
    key: 'fulname',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Status',
    dataIndex: 'is_active',
    key: 'is_active',
    scopedSlots: true,
  },
]

const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const statusFilter = ref<string>()
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<User[]>([])

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

const handleStatusFilter = (): void => {
  // Filter logic here
  console.log('Status filter:', statusFilter.value)
}

const handleTableChange = (event: TableChangeEvent): void => {
  console.log('Table changed:', event)
  currentPage.value = event.pagination.current
  pageSize.value = event.pagination.pageSize

  // Simulate API call
  if (event.action === 'paginate' || event.action === 'sort') {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

const handleSearch = (value: string): void => {
  console.log('Search:', value)
  currentPage.value = 1
}

const addUser = (): void => {}

onMounted(async () => await fetchUsers())
</script>

<template>
  <div>
    <DataTable
      title="Users Management"
      :data="users"
      :columns="columns"
      :loading="isLoading"
      searchable
      search-placeholder="Search users..."
      :row-selection="rowSelection"
      @change="handleTableChange"
      @search="handleSearch"
    >
      <!-- Custom action buttons in header -->
      <template #headerActions>
        <a-button type="primary" @click="addUser"> Add User </a-button>
      </template>

      <!-- Custom filters -->
      <template #filters>
        <a-select v-model:value="statusFilter" placeholder="Filter by status">
          <a-select-option value="active">Active</a-select-option>
          <a-select-option value="inactive">Inactive</a-select-option>
        </a-select>
      </template>

      <!-- Custom column rendering -->
      <template #status="{ text }">
        <a-tag :color="text === 'active' ? 'green' : 'red'">
          {{ text.toUpperCase() }}
        </a-tag>
      </template>

      <!-- Action buttons -->
      <template #action="{ record }">
        <a-space>
          <a-button size="small">Edit</a-button>
          <a-button size="small" danger>Delete</a-button>
        </a-space>
      </template>
    </DataTable>
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
<style scoped></style>
