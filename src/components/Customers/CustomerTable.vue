<script setup lang="ts">
import type {
  DataTableRecord,
  DataTableColumn,
  TableChangeEvent,
  PaginationData,
} from '@/components/Shared/DataTable.vue'
import { useCustomers } from '@/composables/modules/useCustomers'
import type { Customer } from '@/types/customers'
import { Space } from 'ant-design-vue'

const {
  customers,
  pagination,
  isLoading,
  fetchCustomers,
  addCustomer,
  editCustomer,
  statusCustomer,
  removeCustomer,
} = useCustomers()

const { t } = useI18n()
const { renderUserAvatar, renderSwitchButton, renderActionButton, renderDeleteActionButton } =
  useRender()

import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

const statusFilter = ref<string>('')
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<Customer[]>([])
const selectedRow = ref<Customer>({})

const customerFormRef = ref()

const columns: DataTableColumn[] = [
  {
    title: 'FullName',
    dataIndex: 'fullname',
    key: 'fullname', // Fixed: key should match dataIndex
    sorter: true,
    customRender: ({ record }) => {
      return renderUserAvatar(
        record.picture,
        `${record.firstname} ${record.lastname}`,
        `${record.country_code} ${record.phone}`,
      )
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: true,
  }, //
  {
    title: 'Referral',
    dataIndex: 'refercode',
    key: 'refercode',
    sorter: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }) =>
      renderSwitchButton(
        record.status ? t('common.active') : t('common.inactive'),
        record.status,
        () => handleStatusCustomer(record),
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
              handleEditCustomer(record),
            ),
            renderDeleteActionButton(
              t('common.delete', { name: record.fullname }),
              t('common.confirmMessage', { name: record.fullname }),
              () => handleDeleteCustomer(record),
            ),
          ],
        },
      ),
  },
]

// Row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: Customer[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  },
  onSelect: (record: Customer, selected: boolean) => {
    console.log('Selected:', record, selected)
  },
  onSelectAll: (selected: boolean, rows: Customer[], changeRows: Customer[]) => {
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

  // The composable watch will automatically trigger fetchCustomers
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

  // The composable watch will automatically trigger fetchCustomers
}

const showDialog = async (): void => {
  // Add customer logic - you might want to open a modal/form
  customerFormRef.value.openDrawer(false)
}

const handleDialogSubmit = async (formData: Customer) => {
  try {
    isLoading.value = true
    if (isEdit.value) {
      // ✅ Create new customer
      await addCustomer(formData)
      message.success(t('common.createMessage', { name: formData.fullname }))
    } else {
      // ✅ Update existing customer
      if (!formData?.ids) {
        message.error(t('common.noCustomerSelected'))
        return
      }
      await editCustomer(formData.ids, formData)
      message.success(
        t('common.updateMessage', {
          title: t('manageCustomers.customers.customer'),
          name: formData.fullname,
        }),
      )
    }

    // ✅ Close dialog + refresh table
    isLoading.value = false
    await fetchCustomers()
  } catch (error: any) {
    console.error('Submit failed:', error)
    message.error(error.message || t('common.submitFailed'))
    isLoading.value = false
  }
}

const handleEditCustomer = async (customer: Customer) => {
  customerFormRef.value.openDrawer(true, customer)
}

const handleDeleteCustomer = async (customer: Customer) => {
  try {
    await removeCustomer(customer.ids)
    await fetchCustomers() // ✅ Refresh table after deletion
    message.success(t('common.deleteMessage', { name: customer.fullname }))
  } catch (error: any) {
    //console.error('Failed to delete customer:', error)
    message.error(`${t('common.deleteFailed')} ${error.message || ''}`)
  }
}

const handleStatusCustomer = async (customer: Customer) => {
  try {
    const newStatus = !customer.status
    await statusCustomer(customer.ids, { status: newStatus })
    customer.status = newStatus
    message.success(t('common.statusMessage', { name: t('common.status') }))
  } catch (error: any) {
    //console.error('Failed to delete customer:', error)
    message.error(`${t('common.deleteFailed')} ${error || ''}`)
  }
}
</script>

<template>
  <div>
    <DataTable
      title="Customers Management"
      :data="customers"
      :columns="columns"
      :loading="isLoading"
      :pagination="tablesPagination"
      searchable
      remote
      dateRange
      search-placeholder="Search customers..."
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
          {{ t('common.create', { name: t('menu.manageCustomers.newCustomer') }) }}
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

    <CustomerForm ref="customerFormRef" />
  </div>
</template>

<style scoped></style>
