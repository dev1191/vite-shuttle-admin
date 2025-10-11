<script setup lang="ts">
import type {
  DataTableRecord,
  DataTableColumn,
  TableChangeEvent,
  PaginationData,
} from '@/components/Shared/DataTable.vue'
import { useCurrencies } from '@/composables/modules/useCurrencies'
import type { Currency } from '@/types/settings/currencies'
import { Space } from 'ant-design-vue'

const {
  currencies,
  pagination,
  isLoading,
  fetchCurrencies,
  addCurrency,
  editCurrency,
  statusCurrency,
  removeCurrency,
} = useCurrencies()

const { t } = useI18n()
const { renderUserAvatar, renderSwitchButton, renderActionButton, renderDeleteActionButton } =
  useRender()

import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
const dataTableRef = ref()
const statusFilter = ref<string>('')
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<Currency[]>([])
const selectedRow = ref<Currency>({})
const isEdit = ref<boolean>(false)
const countryFormRef = ref()

const columns: DataTableColumn[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name', // Fixed: key should match dataIndex
    sorter: true,
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
    sorter: true,
  }, //
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }) =>
      renderSwitchButton(
        record.status ? t('common.active') : t('common.inactive'),
        record.status,
        () => handleStatusCurrency(record),
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
              handleEditCurrency(record),
            ),
            renderDeleteActionButton(
              t('common.delete', { name: record.fullname }),
              t('common.confirmMessage', { name: record.fullname }),
              () => handleDeleteCurrency(record),
            ),
          ],
        },
      ),
  },
]

// Row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: Currency[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  },
  onSelect: (record: Currency, selected: boolean) => {
    console.log('Selected:', record, selected)
  },
  onSelectAll: (selected: boolean, rows: Currency[], changeRows: Currency[]) => {
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

  // The composable watch will automatically trigger fetchCurrencies
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

  // The composable watch will automatically trigger fetchCurrencies
}

const showDialog = async (): void => {
  // Add country logic - you might want to open a modal/form
  countryFormRef.value.openDrawer(false)
  isEdit.value = false
}

const handleDialogSubmit = async (formData: Currency) => {
  try {
    isLoading.value = true
    if (isEdit.value) {
      // ✅ Update existing country
      if (!formData?.ids) {
        message.error(t('common.noCurrencySelected'))
        return
      }
      await editCurrency(formData.ids, {
        name: formData.name,
        short_name: formData.short_name,
        phone_code: formData.phone_code,
        status: formData.status,
      })
      message.success(
        t('common.updateMessage', {
          title: t('menu.settings.currencies.title'),
          name: formData.name,
        }),
      )
    } else {
      // ✅ Create new country
      await addCurrency(formData)
      message.success(t('common.createMessage', { name: formData.name }))
    }

    // ✅ Close dialog + refresh table
    isLoading.value = false
    isEdit.value = false
    await fetchCurrencies()
  } catch (error: any) {
    console.error('Submit failed:', error)
    message.error(error.message || t('common.submitFailed'))
    isLoading.value = false
  }
}

const handleEditCurrency = async (country: Currency) => {
  countryFormRef.value.openDrawer(true, country)
  isEdit.value = true
}

const handleDeleteCurrency = async (country: Currency) => {
  try {
    const response = await removeCurrency(country.ids)
    await fetchCurrencies() // ✅ Refresh table after deletion
  } catch (error: any) {
    //console.error('Failed to delete country:', error)
    message.error(`${t('common.deleteFailed')} ${error.message || ''}`)
  }
}

const handleStatusCurrency = async (country: Currency) => {
  try {
    const newStatus = !country.status
    await statusCurrency(country.ids, { status: newStatus })
    country.status = newStatus
  } catch (error: any) {
    //console.error('Failed to delete country:', error)
    message.error(`${t('common.deleteFailed')} ${error || ''}`)
  }
}
</script>

<template>
  <div>
    <DataTable
      ref="dataTableRef"
      title="Currencies Management"
      :data="currencies"
      :columns="columns"
      :loading="isLoading"
      :pagination="tablesPagination"
      searchable
      remote
      search-placeholder="Search currencies..."
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
          <a-button size="large" type="default" :loading="isLoading" @click="fetchCurrencies">
            <template #icon>
              <ReloadOutlined spin />
            </template>
          </a-button>
        </a-tooltip>
        <a-button size="large" type="primary" @click="showDialog">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ t('common.create', { name: t('menu.settings.currencies.newCurrency') }) }}
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

    <CurrencyForm ref="countryFormRef" :isEdit="isEdit" @submit="handleDialogSubmit" />
  </div>
</template>

<style scoped></style>
