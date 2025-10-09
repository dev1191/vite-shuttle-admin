vb
<script setup lang="ts">
import type {
  DataTableRecord,
  DataTableColumn,
  TableChangeEvent,
  PaginationData,
} from '@/components/Shared/DataTable.vue'
import { useCountries } from '@/composables/modules/useCountries'
import type { Country } from '@/types'
import { Space } from 'ant-design-vue'

const {
  countries,
  pagination,
  isLoading,
  fetchCountries,
  addCountry,
  editCountry,
  statusCountry,
  removeCountry,
} = useCountries()

const { t } = useI18n()
const { renderUserAvatar, renderSwitchButton, renderActionButton, renderDeleteActionButton } =
  useRender()

import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { formatDate } from '@/utils'

const statusFilter = ref<string>('')
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<Country[]>([])
const selectedRow = ref<Country>({})

const countryFormRef = ref()

const columns: DataTableColumn[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name', // Fixed: key should match dataIndex
    sorter: true,
  },
  {
    title: 'Short Name',
    dataIndex: 'short_name',
    key: 'short_name',
    sorter: true,
  }, //
  {
    title: 'Phone Code',
    dataIndex: 'phone_code',
    key: 'phone_code',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }) =>
      renderSwitchButton(
        record.status ? t('common.active') : t('common.inactive'),
        record.status,
        () => handleStatusCountry(record),
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
              handleEditCountry(record),
            ),
            renderDeleteActionButton(
              t('common.delete', { name: record.fullname }),
              t('common.confirmMessage', { name: record.fullname }),
              () => handleDeleteCountry(record),
            ),
          ],
        },
      ),
  },
]

// Row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: Country[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  },
  onSelect: (record: Country, selected: boolean) => {
    console.log('Selected:', record, selected)
  },
  onSelectAll: (selected: boolean, rows: Country[], changeRows: Country[]) => {
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

  // The composable watch will automatically trigger fetchCountries
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

  // The composable watch will automatically trigger fetchCountries
}

const showDialog = async (): void => {
  // Add country logic - you might want to open a modal/form
  countryFormRef.value.openDrawer(false)
}

const handleDialogSubmit = async (formData: Country) => {
  try {
    isLoading.value = true
    if (isEdit.value) {
      // ✅ Create new country
      await addCountry(formData)
      message.success(t('common.createMessage', { name: formData.name }))
    } else {
      // ✅ Update existing country
      if (!formData?.ids) {
        message.error(t('common.noCountrySelected'))
        return
      }
      await editCountry(formData.ids, formData)
      message.success(
        t('common.updateMessage', {
          title: t('menu.settings.countries.title'),
          name: formData.name,
        }),
      )
    }

    // ✅ Close dialog + refresh table
    isLoading.value = false
    await fetchCountries()
  } catch (error: any) {
    console.error('Submit failed:', error)
    message.error(error.message || t('common.submitFailed'))
    isLoading.value = false
  }
}

const handleEditCountry = async (country: Country) => {
  countryFormRef.value.openDrawer(true, country)
}

const handleDeleteCountry = async (country: Country) => {
  try {
    const response = await removeCountry(country.ids)
    await fetchCountries() // ✅ Refresh table after deletion
  } catch (error: any) {
    //console.error('Failed to delete country:', error)
    message.error(`${t('common.deleteFailed')} ${error.message || ''}`)
  }
}

const handleStatusCountry = async (country: Country) => {
  try {
    const newStatus = !country.status
    await statusCountry(country.ids, { status: newStatus })
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
      title="Countries Management"
      :data="countries"
      :columns="columns"
      :loading="isLoading"
      :pagination="tablesPagination"
      searchable
      remote
      search-placeholder="Search countries..."
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
          {{ t('common.create', { name: t('menu.settings.countries.newCountry') }) }}
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

    <CountryForm ref="countryFormRef" />
  </div>
</template>

<style scoped></style>
