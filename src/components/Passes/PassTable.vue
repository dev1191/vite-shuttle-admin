<script setup lang="ts">
import type {
  DataTableRecord,
  DataTableColumn,
  TableChangeEvent,
  PaginationData,
} from '@/components/Shared/DataTable.vue'
import { usePasses } from '@/composables/modules/usePasses'
import { Space } from 'ant-design-vue'

const { passs, pagination, isLoading, fetchPasses, addPass, editPass, statusPass, removePass } =
  usePasses()

const { t } = useI18n()
const { renderUserAvatar, renderSwitchButton, renderActionButton, renderDeleteActionButton } =
  useRender()

import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { formatDate } from '@/utils'
import type { Pass } from '@/types/passes'

const statusFilter = ref<string>('')
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<Pass[]>([])
const selectedRow = ref<Pass>({})
const isEdit = ref<boolean>(false)
const passFormRef = ref()

const columns: DataTableColumn[] = [
  {
    title: t('menu.passes.form.noOfRides'),
    dataIndex: 'no_of_rides',
    key: 'no_of_rides', // Fixed: key should match dataIndex
    sorter: true,
  },
  {
    title: t('menu.passes.form.validDays'),
    dataIndex: 'no_of_valid_days',
    key: 'no_of_valid_days',
    sorter: true,
  }, //
  {
    title: t('menu.passes.form.pricePerKm'),
    dataIndex: 'price_per_km',
    key: 'price_per_km',
    sorter: true,
  },
  {
    title: t('menu.passes.form.discount'),
    dataIndex: 'discount',
    key: 'discount',
    sorter: true,
  },
  {
    title: t('common.status'),
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }) =>
      renderSwitchButton(
        record.status ? t('common.active') : t('common.inactive'),
        record.status,
        () => handleStatusPass(record),
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
              handleEditPass(record),
            ),
            renderDeleteActionButton(
              t('common.delete', { name: t('menu.passes.pass') }),
              t('common.confirmMessage', { name: t('menu.passes.pass') }),
              () => handleDeletePass(record),
            ),
          ],
        },
      ),
  },
]

// Row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: Pass[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  },
  onSelect: (record: Pass, selected: boolean) => {
    console.log('Selected:', record, selected)
  },
  onSelectAll: (selected: boolean, rows: Pass[], changeRows: Pass[]) => {
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

  // The composable watch will automatically trigger fetchPasses
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

  // The composable watch will automatically trigger fetchPasses
}

const showDialog = async (): void => {
  // Add pass logic - you might want to open a modal/form
  passFormRef.value.openDrawer(false)
}

const handleDialogSubmit = async (formData: Pass) => {
  try {
    isLoading.value = true
    passFormRef.value.loading = true
    if (!isEdit.value) {
      // ✅ Create new pass
      await addPass(formData)
      message.success(t('common.createMessage', { name: t('menu.passes.newPass') }))
    } else {
      // ✅ Update existing pass
      if (!formData?.ids) {
        message.error(t('common.noSelected'))
        return
      }
      await editPass(formData.ids, {
        no_of_rides: formData.no_of_rides,
        no_of_valid_days: formData.no_of_valid_days,
        price_per_km: formData.price_per_km,
        discount: formData.discount,
        terms: formData.terms,
        description: formData.description,
        status: formData.status,
      })
      message.success(
        t('common.updateMessage', {
          title: t('menu.passes.pass'),
        }),
      )
    }

    // ✅ Close dialog + refresh table
    isLoading.value = false
    await fetchPasses()
    passFormRef.value.handleClose()
    passFormRef.value.loading = false
  } catch (error: any) {
    console.error('Submit failed:', error)
    message.error(error.message || t('common.submitFailed'))
    isLoading.value = false
  }
}

const handleEditPass = async (pass: Pass) => {
  passFormRef.value.openDrawer(true, pass)
  isEdit.value = true
}

const handleDeletePass = async (pass: Pass) => {
  try {
    await removePass(pass.ids)
    await fetchPasses() // ✅ Refresh table after deletion
  } catch (error: any) {
    //console.error('Failed to delete pass:', error)
    message.error(`${t('common.deleteFailed')} ${error.message || ''}`)
  }
}

const handleStatusPass = async (pass: Pass) => {
  try {
    const newStatus = !pass.status
    await statusPass(pass.ids, { status: newStatus })
    pass.status = newStatus
    message.success(t('common.statusMessage', { name: t('common.status') }))
  } catch (error: any) {
    //console.error('Failed to delete pass:', error)
    message.error(`${t('common.deleteFailed')} ${error || ''}`)
  }
}
</script>

<template>
  <div>
    <DataTable
      title="Passes Management"
      :data="passs"
      :columns="columns"
      :loading="isLoading"
      :pagination="tablesPagination"
      searchable
      remote
      search-placeholder="Search passs..."
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
          {{ t('common.create', { name: t('menu.passes.newPass') }) }}
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

    <PassForm
      ref="passFormRef"
      @submit="handleDialogSubmit"
      :isEdit="isEdit"
      :isLoading="isLoading"
    />
  </div>
</template>

<style scoped></style>
