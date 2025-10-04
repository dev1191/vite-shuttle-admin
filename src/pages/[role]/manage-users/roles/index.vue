<script setup lang="ts">
import RoleDialog from '@/components/AdminUsers/RoleDialog.vue'
import type {
  DataTableRecord,
  DataTableColumn,
  TableChangeEvent,
  PaginationData,
} from '@/components/Shared/DataTable.vue'
import { useRoles } from '@/composables/modules/useRoles'
import { Tag, Modal, Space, Tooltip } from 'ant-design-vue'

const { fetchRoles, roles, isLoading, pagination } = useRoles()
const { t } = useI18n()
const { renderActionButton } = useRender()

const selectedRows = ref<User[]>([])
const selectedRow = ref<User>({})
const dialogVisible = ref<boolean>(false)
const dialogType = ref('add')

const columns: DataTableColumn[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name', // Fixed: key should match dataIndex
    sorter: true,
  },
  {
    title: 'Permissions',
    dataIndex: 'permissions',
    key: 'permissions', // Fixed: key should match dataIndex
    customRender: ({ record }) => {
      const perms: { id: number | string; name: string; slug: string }[] = record.permissions || []
      const visibleTags = perms.slice(0, 4)
      const remainingCount = perms.length - visibleTags.length

      const modalVisible = ref(false)

      const showModal = () => {
        modalVisible.value = true
      }

      const handleCancel = () => {
        modalVisible.value = false
      }

      return h(
        Space,
        { size: 'small', wrap: true },
        {
          default: () => [
            // Show first 4 tags
            ...visibleTags.map((perm) =>
              h(Tag, { color: 'blue', key: perm.id }, { default: () => perm.name }),
            ),
            // Show +N tag to open modal
            remainingCount > 0
              ? h(
                  Tooltip,
                  { title: 'View all permissions', key: 'more-perms' },
                  {
                    default: () =>
                      h(
                        Tag,
                        {
                          color: 'default',
                          key: 'more',
                          onClick: showModal,
                          style: { cursor: 'pointer' },
                        },
                        { default: () => `+${remainingCount}` },
                      ),
                  },
                )
              : null,
            // Modal
            modalVisible.value &&
              h(
                Modal,
                {
                  open: modalVisible.value,
                  title: 'All Permissions',
                  onCancel: handleCancel,
                  footer: null,
                  width: '800px',
                },
                {
                  default: () =>
                    h(
                      Space,
                      { direction: 'horizontal', size: 'small', wrap: true },
                      {
                        default: () =>
                          perms.map((perm) =>
                            h(Tag, { color: 'blue', key: perm.id }, { default: () => perm.name }),
                          ),
                      },
                    ),
                },
              ),
          ],
        },
      )
    },
  },
  {
    title: 'Actions',
    dataIndex: 'action',
    key: 'action',
    customRender: ({ record }) =>
      h(
        Space,
        { direction: 'horizontal', size: 'middle' }, // horizontal spacing
        {
          default: () => [
            renderActionButton('hugeicons:pencil-edit-02', t('common.edit'), () =>
              handleEditRole(record),
            ),
          ],
        },
      ),
  },
]

const handleEditRole = async (user: User): void => {
  selectedRow.value = user
  dialogVisible.value = true
  dialogType.value = 'edit'
}

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

const handleTableChange = (event: TableChangeEvent): void => {
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
}

// Handle pagination changes from DataTable
const handlePaginationChange = (newPagination: PaginationData): void => {
  pagination.value.page = newPagination.page
  pagination.value.itemsPerPage = newPagination.itemsPerPage
  pagination.value.globalSearch = newPagination.globalSearch
  pagination.value.sortBy = newPagination.sortBy
  pagination.value.sortDesc = newPagination.sortDesc
  pagination.value.range = newPagination.range
}

const handleDialogSubmit = () => {}
</script>

<template>
  <div>
    <DataTable
      title="Roles Management"
      :data="roles"
      :columns="columns"
      :loading="isLoading"
      :pagination="tablesPagination"
      searchable
      remote
      :search-placeholder="t('common.search', { name: t('manageUsers.roles.role').toLowerCase() })"
      @change="handleTableChange"
      @search="handleSearch"
      @pagination-change="handlePaginationChange"
    />

    <RoleDialog
      v-model:visible="dialogVisible"
      :isLoading="isLoading"
      :type="dialogType"
      :role-data="selectedRow"
      @submit="handleDialogSubmit"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: defaultLayout
  title: manageUsers.roles
  icon: RolegroupOutlined
  drawerIndex: 1
  order: 3
  hidden: false
  roles: [admin, agent, staff, manager]
  breadcrumb:
    - manageUsers.users
    - manageUsers.roles
</route>

<style scoped></style>
