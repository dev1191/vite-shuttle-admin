<script setup lang="ts">
import type {
  DataTableRecord,
  DataTableColumn,
  TableChangeEvent,
  PaginationData,
} from '@/components/Shared/DataTable.vue'
import { useHelpAndSupport } from '@/composables/modules/useHelpAndSupport'
import { Space } from 'ant-design-vue'

const {
  helpers,
  pagination,
  isLoading,
  fetchHelpAndSupports,
  editHelpAndSupport,
  statusHelpAndSupport,
  removeHelpAndSupport,
} = useHelpAndSupport()

const { t } = useI18n()
const { renderUserAvatar, renderTag, renderActionButton, renderDeleteActionButton } = useRender()

import { PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import type { HelpAndSupport, Reply } from '@/types/helpAndSupports'
import { formatDate } from '@/utils'

const statusFilter = ref<string>('')
const selectedRowKeys = ref<(string | number)[]>([])
const selectedRows = ref<HelpAndSupport[]>([])
const selectedRow = ref<HelpAndSupport>({})
const isEdit = ref<boolean>(false)
const modalVisible = ref<boolean>(false)
const modalEditVisible = ref<boolean>(false)
const helperFormRef = ref()

const columns: DataTableColumn[] = [
  {
    title: t('menu.helpAndSupports.form.ticketNo'),
    dataIndex: 'ticket_no',
    key: 'ticket_no', // Fixed: key should match dataIndex
    sorter: true,
  },
  {
    title: t('menu.helpAndSupports.form.fullName'),
    dataIndex: 'firstname',
    key: 'firstname',
    sorter: true,
    customRender: ({ record }) => {
      return renderUserAvatar('', `${record.firstname} ${record.lastname}`, `${record.phone}`)
    },
  }, //
  {
    title: t('menu.helpAndSupports.form.description'),
    dataIndex: 'description_short',
    key: 'description_short',
    sorter: true,
  },
  {
    title: t('common.status'),
    dataIndex: 'status',
    key: 'status',
    sorter: true,
    customRender: ({ record }) => {
      const ticketStatusEnum = {
        OPEN: 'Open',
        IN_PROGRESS: 'In Progress',
        REPLIED: 'Replied',
        CLOSED: 'Closed',
      } as const

      const statusColorMap: Record<string, string> = {
        OPEN: 'red',
        IN_PROGRESS: 'processing',
        REPLIED: 'warning',
        CLOSED: 'success',
      }

      const upperText = record.status.toUpperCase() as keyof typeof ticketStatusEnum
      const color = statusColorMap[upperText] || 'default'
      return renderTag(ticketStatusEnum[upperText], color, 'ticketStatus')
    },
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    customRender: ({ record }) => formatDate(record.createdAt),
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
            renderActionButton('hugeicons:view', t('common.view'), () =>
              handleViewHelpAndSupport(record),
            ),
            renderActionButton('hugeicons:mail-reply-01', t('common.reply'), () =>
              handleEditHelpAndSupport(record),
            ),
            renderDeleteActionButton(
              t('common.delete', { name: t('menu.helpAndSupports.helper') }),
              t('common.confirmMessage', { name: t('menu.helpAndSupports.helper') }),
              () => handleDeleteHelpAndSupport(record),
            ),
          ],
        },
      ),
  },
]

// Row selection configuration
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: (string | number)[], rows: HelpAndSupport[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  },
  onSelect: (record: HelpAndSupport, selected: boolean) => {
    console.log('Selected:', record, selected)
  },
  onSelectAll: (selected: boolean, rows: HelpAndSupport[], changeRows: HelpAndSupport[]) => {
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
    value: typeof statusFilter.value == 'undefined' ? '' : statusFilter.value,
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

  // The composable watch will automatically trigger fetchHelpAndSupports
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

  // The composable watch will automatically trigger fetchHelpAndSupports
}

const showDialog = async (): void => {
  // Add helper logic - you might want to open a modal/form
  helperFormRef.value.openDrawer(false)
}

const handleDialogSubmit = async (formData: Reply) => {
  try {
    isLoading.value = true
    helperFormRef.value.loading = true
    if (!isEdit.value) {
      message.success(
        t('common.createMessage', { name: t('menu.helpAndSupports.newHelpAndSupport') }),
      )
    } else {
      // ✅ Update existing helper
      if (!formData?.ids) {
        message.error(t('common.noSelected'))
        return
      }
      await editHelpAndSupport(formData.ids, {
        subject: formData.subject,
        message: formData.message,
        type: formData.type,
        status: formData.status,
      })
      message.success(
        t('common.updateMessage', {
          title: t('menu.helpAndSupports.helper'),
        }),
      )
    }

    // ✅ Close dialog + refresh table
    isLoading.value = false
    await fetchHelpAndSupports()
    modalEditVisible.value = false
  } catch (error: any) {
    console.error('Submit failed:', error)
    message.error(error.message || t('common.submitFailed'))
    isLoading.value = false
  }
}

const handleEditHelpAndSupport = async (helper: HelpAndSupport) => {
  selectedRow.value = helper
  isEdit.value = true
  modalEditVisible.value = true
}

const handleViewHelpAndSupport = async (helper: HelpAndSupport) => {
  selectedRow.value = helper
  modalVisible.value = true
}

const handleDeleteHelpAndSupport = async (helper: HelpAndSupport) => {
  try {
    await removeHelpAndSupport(helper._id)
    await fetchHelpAndSupports() // ✅ Refresh table after deletion
  } catch (error: any) {
    //console.error('Failed to delete helper:', error)
    message.error(`${t('common.deleteFailed')} ${error.message || ''}`)
  }
}

const handleStatusHelpAndSupport = async (helper: HelpAndSupport) => {
  try {
    const newStatus = !helper.status
    await statusHelpAndSupport(helper.ids, { status: newStatus })
    helper.status = newStatus
    message.success(t('common.statusMessage', { name: t('common.status') }))
  } catch (error: any) {
    //console.error('Failed to delete helper:', error)
    message.error(`${t('common.deleteFailed')} ${error || ''}`)
  }
}
</script>

<template>
  <DataTable
    title="Help And Support Management"
    :data="helpers"
    :columns="columns"
    :loading="isLoading"
    :pagination="tablesPagination"
    searchable
    remote
    dateRange
    search-placeholder="Search query..."
    @change="handleTableChange"
    @search="handleSearch"
    @pagination-change="handlePaginationChange"
  >
    <!-- Custom action buttons in header -->
    <template #headerActions> </template>

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
        <a-select-option value="Open">Open</a-select-option>
        <a-select-option value="In Progress">In Progress</a-select-option>
        <a-select-option value="Replied">Replied</a-select-option>
        <a-select-option value="Closed">Closed</a-select-option>
      </a-select>
    </template>
  </DataTable>

  <HelpAndSupportForm
    ref="helperFormRef"
    :visible="modalEditVisible"
    :item="selectedRow"
    @submit="handleDialogSubmit"
    :isEdit="isEdit"
    :isLoading="isLoading"
  />

  <ViewHelpAndSupport v-model:visible="modalVisible" :item="selectedRow" />
</template>

<style scoped></style>
