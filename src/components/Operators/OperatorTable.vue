<script setup lang="ts">
import type {
  DataTableRecord,
  DataTableColumn,
  TableChangeEvent,
  PaginationData,
} from '@/components/Shared/DataTable.vue'
import { useOperators } from '@/composables/modules/useOperators'
import type { Operator } from '@/types/Operators'
import { Space } from 'ant-design-vue'

const {
  Operators,
  pagination,
  isLoading,
  fetchOperators,
  addOperator,
  editOperator,
  statusOperator,
  removeOperator,
} = useOperators()

const { t } = useI18n()
const { renderUserAvatar, renderSwitchButton, renderActionButton, renderDeleteActionButton } =
  useRender()

import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useUserStore } from '@/stores/modules/user.store'
const dataTableRef = ref()
const statusFilter = ref<string>('')
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<Operator[]>([])
const selectedRow = ref<Operator>({})
const isEdit = ref<boolean>(false)
const OperatorFormRef = ref()
const router = useRouter()

const { user } = useUserStore()

const columns: DataTableColumn[] = [
  {
    title: t('menu.manageOperators.form.company'),
    dataIndex: 'admin_details.company',
    key: 'admin_details.company',
    sorter: true,
  }, //
  {
    title: t('menu.manageOperators.form.fullname'),
    dataIndex: 'fullname',
    key: 'fullname', // Fixed: key should match dataIndex
    sorter: true,
    customRender: ({ record }) => {
      return renderUserAvatar(record.picture, `${record.fullname}`, `${record.email}`)
    },
  },
  {
    title: t('menu.manageOperators.form.phone'),
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: t('common.status'),
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }) =>
      renderSwitchButton(
        record.status ? t('common.active') : t('common.inactive'),
        record.status,
        () => handleStatusOperator(record),
      ),
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
              handleEditOperator(record),
            ),
            renderDeleteActionButton(
              t('common.delete', { name: record.fullname }),
              t('common.confirmMessage', { name: record.fullname }),
              () => handleDeleteOperator(record),
            ),
          ],
        },
      ),
  },
]

// Row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: Operator[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  },
  onSelect: (record: Operator, selected: boolean) => {
    console.log('Selected:', record, selected)
  },
  onSelectAll: (selected: boolean, rows: Operator[], changeRows: Operator[]) => {
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
  pagination.value.filters = {
    type: 'simple',
    name: typeof statusFilter.value == 'undefined' ? '' : 'status',
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

  // The composable watch will automatically trigger fetchOperators
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

  // The composable watch will automatically trigger fetchOperators
}

const showDialog = async (): Promise<void> => {
  // Add Operator logic - you might want to open a modal/form
  router.push({
    path: `/${user?.role}/manage-operators/create`,
  })
}

const handleDialogSubmit = async (formData: Operator) => {
  try {
    isLoading.value = true
    if (isEdit.value) {
      // ✅ Update existing Operator
      if (!formData?.ids) {
        message.error(t('common.noOperatorSelected'))
        return
      }
      await editOperator(formData.ids, {
        name: formData.name,
        short_name: formData.short_name,
        phone_code: formData.phone_code,
        status: formData.status,
      })
      message.success(
        t('common.updateMessage', {
          title: t('menu.settings.Operators.title'),
          name: formData.name,
        }),
      )
    } else {
      // ✅ Create new Operator
      await addOperator(formData)
      message.success(t('common.createMessage', { name: formData.name }))
    }

    // ✅ Close dialog + refresh table
    isLoading.value = false
    isEdit.value = false
    await fetchOperators()
  } catch (error: any) {
    console.error('Submit failed:', error)
    message.error(error.message || t('common.submitFailed'))
    isLoading.value = false
  }
}

const handleEditOperator = async (Operator: Operator) => {
  router.push({
    path: `/${user?.role}/manage-operators/${Operator.ids}`,
  })
  isEdit.value = true
}

const handleDeleteOperator = async (Operator: Operator) => {
  try {
    const response = await removeOperator(Operator.ids)
    await fetchOperators() // ✅ Refresh table after deletion
  } catch (error: any) {
    //console.error('Failed to delete Operator:', error)
    message.error(`${t('common.deleteFailed')} ${error.message || ''}`)
  }
}

const handleStatusOperator = async (Operator: Operator) => {
  try {
    const newStatus = !Operator.status
    await statusOperator(Operator.ids, { status: newStatus })
    Operator.status = newStatus
  } catch (error: any) {
    //console.error('Failed to delete Operator:', error)
    message.error(`${t('common.deleteFailed')} ${error || ''}`)
  }
}
</script>

<template>
  <div>
    <DataTable
      ref="dataTableRef"
      title="Operators Management"
      :data="Operators"
      :columns="columns"
      :loading="isLoading"
      :pagination="tablesPagination"
      searchable
      remote
      dateRange
      search-placeholder="Search Operators..."
      :row-selection="rowSelection"
      @change="handleTableChange"
      @search="handleSearch"
      @pagination-change="handlePaginationChange"
    >
      <!-- Custom action buttons in header -->
      <template #headerActions>
        <!-- Refresh Button -->
        <a-tooltip>
          <template #title>{{ t('common.refresh') }}</template>
          <a-button size="large" type="default" :loading="isLoading" @click="fetchOperators">
            <template #icon>
              <ReloadOutlined spin />
            </template>
          </a-button>
        </a-tooltip>
        <a-button size="large" type="primary" @click="showDialog">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ t('common.create', { name: t('menu.manageOperators.newOperator') }) }}
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
    </DataTable>

    <!-- <OperatorForm ref="OperatorFormRef" :isEdit="isEdit" @submit="handleDialogSubmit" /> -->
  </div>
</template>

<style scoped></style>
