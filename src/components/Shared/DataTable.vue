<template>
  <div class="data-table-wrapper">
    <!-- Header with title and actions -->
    <div class="flex justify-end items-center mb-4" v-if="$slots.headerActions">
      <div class="flex gap-2">
        <slot name="headerActions"></slot>
      </div>
    </div>

    <!-- Search and filters -->
    <div
      class="flex justify-between items-center mb-4 gap-4 flex-col md:flex-row"
      v-if="searchable || $slots.filters"
    >
      <a-input
        v-if="searchable"
        v-model:value="searchValue"
        :placeholder="searchPlaceholder"
        allow-clear
        size="large"
        class="w-full md:max-w-sm"
        @input="onSearchInput"
        @change="onSearch"
        @pressEnter="onSearch"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>

      <div class="flex gap-2 items-center flex-wrap">
        <a-button v-if="hasActiveFilters" @click="resetFilters" size="small">
          Clear Filters
        </a-button>
        <!-- Date Range Filter (if enabled) -->
        <div v-if="dateRange">
          <a-range-picker
            size="large"
            v-model:value="dateRangeValue"
            @change="onDateRangeChange"
            :placeholder="['Start Date', 'End Date']"
            format="YYYY-MM-DD"
            clearable
          />
        </div>
        <slot name="filters"></slot>
      </div>
    </div>

    <!-- Data Table -->
    <a-table
      :columns="processedColumns"
      :data-source="tableData"
      :loading="loading"
      :pagination="paginationConfig"
      :row-selection="rowSelection"
      :scroll="scroll"
      :size="size"
      :bordered="bordered"
      :row-key="rowKey"
      @change="handleTableChange"
      @expand="handleExpand"
      v-bind="$attrs"
      class="ant-table-striped"
    >
      <!-- Dynamic column slots -->
      <template
        v-for="column in columnsWithSlots"
        :key="column.key"
        #[column.key]="{ text, record, index }"
      >
        <slot :name="column.key" :text="text" :record="record" :index="index">
          {{ text }}
        </slot>
      </template>

      <!-- Action column slot -->
      <template #action="{ record, index }" v-if="$slots.action">
        <slot name="action" :record="record" :index="index"></slot>
      </template>

      <!-- Expandable row slot -->
      <template #expandedRowRender="{ record, index }" v-if="$slots.expandedRow">
        <slot name="expandedRow" :record="record" :index="index"></slot>
      </template>

      <!-- Custom body cell (alternative method for column slots) -->
      <template #bodyCell="{ column, text, record, index }">
        <!-- Check if there's a custom slot for this column -->
        <slot
          v-if="$slots[column.key]"
          :name="column.key"
          :text="text"
          :record="record"
          :index="index"
        >
          {{ text }}
        </slot>

        <!-- Action column -->
        <template v-else-if="column.key === 'action'">
          <slot name="action" :record="record" :index="index"></slot>
        </template>

        <!-- Default rendering -->
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>

    <!-- Custom footer -->
    <div class="mt-4" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import type { TableColumnType, TableProps } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import { placements } from 'ant-design-vue/es/vc-tour/placements'

// Types
export interface DataTableColumn extends TableColumnType {
  key: string
  dataIndex?: string
  title: string
  scopedSlots?: boolean
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
}

export interface DataTableRecord {
  [key: string]: any
  id?: string | number
}

export interface PaginationData {
  page: number
  itemsPerPage: number
  globalSearch: string
  sortBy: string
  sortDesc: string
  range: {
    start: string
    end: string
  }
  totalRecords: number
}

export interface TableChangeEvent {
  pagination: {
    current: number
    pageSize: number
    total?: number
  }
  filters: Record<string, any>
  sorter: {
    field?: string
    order?: 'ascend' | 'descend'
    column?: any
    columnKey?: string
  }
  action: string
}

export interface DataTableProps {
  data?: DataTableRecord[]
  columns: DataTableColumn[]
  loading?: boolean
  title?: string
  size?: 'default' | 'middle' | 'small'
  bordered?: boolean
  rowKey?: string | ((record: DataTableRecord) => string)
  scroll?: { x?: number; y?: number }
  pagination?: PaginationData | false
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: string[]
  rowSelection?: TableProps['rowSelection']
  remote?: boolean
  dateRange?: boolean
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  showTotal?: boolean
  pageSizeOptions?: string[]
}

// Props
const props = withDefaults(defineProps<DataTableProps>(), {
  data: () => [],
  loading: false,
  title: '',
  size: 'default',
  bordered: false,
  rowKey: 'id',
  scroll: () => ({}),
  pagination: () => ({
    page: 1,
    itemsPerPage: 10,
    globalSearch: '',
    sortBy: 'createdAt',
    sortDesc: 'desc',
    range: {
      start: '',
      end: '',
    },
    totalRecords: 0,
  }),
  searchable: true,
  searchPlaceholder: 'Search...',
  searchKeys: () => [],
  rowSelection: undefined,
  remote: true,
  dateRange: false,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: true,
  pageSizeOptions: () => ['10', '20', '50', '100'],
})

// Emits
const emit = defineEmits<{
  change: [event: TableChangeEvent]
  search: [value: string]
  expand: [expanded: boolean, record: DataTableRecord]
  'selection-change': [selectedRowKeys: (string | number)[], selectedRows: DataTableRecord[]]
  'date-range-change': [range: { start: string; end: string }]
  'pagination-change': [pagination: PaginationData]
}>()

// Reactive data
const searchValue = ref<string>('')
const dateRangeValue = ref<[Dayjs, Dayjs] | null>(null)
const currentFilters = ref<Record<string, any>>({})

// Initialize search value from pagination
onMounted(() => {
  if (props.pagination && typeof props.pagination === 'object') {
    searchValue.value = props.pagination.globalSearch || ''
  }
})

// Computed properties
const processedColumns = computed<DataTableColumn[]>(() => {
  return props.columns.map((column) => ({
    ...column,
    sorter: column.sortable !== false,
    ...(column.sortable !== false && column.sorter === undefined ? { sorter: true } : {}),
  }))
})

const columnsWithSlots = computed<DataTableColumn[]>(() => {
  return props.columns.filter((column) => column.scopedSlots)
})

const tableData = computed<DataTableRecord[]>(() => {
  if (props.remote) {
    return props.data
  }

  let filtered = [...props.data]

  // Apply search filter for local data
  if (searchValue.value && !props.remote) {
    const searchKeys =
      props.searchKeys.length > 0
        ? props.searchKeys
        : (props.columns.map((col) => col.dataIndex || col.key).filter(Boolean) as string[])

    filtered = filtered.filter((item) => {
      return searchKeys.some((key) => {
        const value = getNestedValue(item, key)
        return value && value.toString().toLowerCase().includes(searchValue.value.toLowerCase())
      })
    })
  }

  return filtered
})

const paginationConfig = computed(() => {
  if (props.pagination === false) return false

  const paginationData = props.pagination as PaginationData

  const config = {
    position: ['bottomCenter'],
    size: 'large',
    current: paginationData.page,
    pageSize: paginationData.itemsPerPage,
    total: paginationData.totalRecords,
    showSizeChanger: props.showSizeChanger,
    showQuickJumper: props.showQuickJumper,
    pageSizeOptions: props.pageSizeOptions,
    showTotal: props.showTotal
      ? (total: number, range: [number, number]) =>
          `Showing ${range[0]}-${range[1]} of ${total} items`
      : undefined,
  }

  return config
})

const hasActiveFilters = computed(() => {
  return (
    searchValue.value ||
    (dateRangeValue.value && dateRangeValue.value.length > 0) ||
    Object.keys(currentFilters.value).length > 0
  )
})

// Methods
const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const handleTableChange = (
  pagination: any,
  filters: Record<string, any>,
  sorter: any,
  { action }: { action: string },
): void => {
  currentFilters.value = filters

  // Determine action type
  let actionType = action
  if (
    pagination.current !== (props.pagination as PaginationData)?.page ||
    pagination.pageSize !== (props.pagination as PaginationData)?.itemsPerPage
  ) {
    actionType = 'paginate'
  }
  if (sorter && (sorter.order || sorter.field)) {
    actionType = 'sort'
  }
  if (Object.keys(filters).length > 0) {
    actionType = 'filter'
  }

  let sortField = ''
  let sortOrder = 'desc'

  if (sorter && !Array.isArray(sorter)) {
    sortField = sorter.field || sorter.columnKey || ''
    sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'
  }

  const paginationData: PaginationData = {
    page: pagination.current,
    itemsPerPage: pagination.pageSize,
    globalSearch: searchValue.value,
    sortBy: sortField,
    sortDesc: sortOrder,
    range: {
      start: dateRangeValue.value?.[0]?.format('YYYY-MM-DD') || '',
      end: dateRangeValue.value?.[1]?.format('YYYY-MM-DD') || '',
    },
    totalRecords: (props.pagination as PaginationData)?.totalRecords || 0,
  }

  const changeEvent: TableChangeEvent = {
    pagination: {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: paginationData.totalRecords,
    },
    filters: currentFilters.value,
    sorter: {
      field: sortField,
      order: sorter?.order,
      column: sorter?.column,
      columnKey: sorter?.columnKey,
    },
    action: actionType,
  }

  emit('change', changeEvent)
  if (props.remote) {
    emit('pagination-change', paginationData)
  }
}

let searchTimeout: NodeJS.Timeout

const onSearchInput = (): void => {
  // Debounce search input
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    onSearch()
  }, 300)
}

const onSearch = (): void => {
  if (props.remote) {
    const paginationData: PaginationData = {
      page: 1, // Reset to first page when searching
      itemsPerPage: (props.pagination as PaginationData)?.itemsPerPage || 10,
      globalSearch: searchValue.value,
      sortBy: (props.pagination as PaginationData)?.sortBy || '',
      sortDesc: (props.pagination as PaginationData)?.sortDesc || 'desc',
      range: {
        start: dateRangeValue.value?.[0]?.format('YYYY-MM-DD') || '',
        end: dateRangeValue.value?.[1]?.format('YYYY-MM-DD') || '',
      },
      totalRecords: (props.pagination as PaginationData)?.totalRecords || 0,
    }
    emit('pagination-change', paginationData)
  }

  emit('search', searchValue.value)
}

const onDateRangeChange = (dates: [Dayjs, Dayjs] | null): void => {
  const range = {
    start: dates?.[0]?.format('YYYY-MM-DD') || '',
    end: dates?.[1]?.format('YYYY-MM-DD') || '',
  }

  const paginationData: PaginationData = {
    page: 1, // Reset to first page when changing date range
    itemsPerPage: (props.pagination as PaginationData)?.itemsPerPage || 10,
    globalSearch: searchValue.value,
    sortBy: (props.pagination as PaginationData)?.sortBy || '',
    sortDesc: (props.pagination as PaginationData)?.sortDesc || 'desc',
    range,
    totalRecords: (props.pagination as PaginationData)?.totalRecords || 0,
  }

  emit('date-range-change', range)
  emit('pagination-change', paginationData)
}

const handleExpand = (expanded: boolean, record: DataTableRecord): void => {
  emit('expand', expanded, record)
}

const resetFilters = (): void => {
  searchValue.value = ''
  dateRangeValue.value = null
  currentFilters.value = {}

  const paginationData: PaginationData = {
    page: 1,
    itemsPerPage: (props.pagination as PaginationData)?.itemsPerPage || 10,
    globalSearch: '',
    sortBy: '',
    sortDesc: 'desc',
    range: {
      start: '',
      end: '',
    },
    totalRecords: (props.pagination as PaginationData)?.totalRecords || 0,
  }

  emit('pagination-change', paginationData)
}

const refreshData = (): void => {
  const currentPagination = props.pagination as PaginationData
  emit('pagination-change', currentPagination)
}

// Watch for external pagination changes
watch(
  () => props.pagination,
  (newPagination) => {
    if (newPagination && typeof newPagination === 'object') {
      searchValue.value = newPagination.globalSearch || ''

      if (newPagination.range.start && newPagination.range.end) {
        // Set date range if provided
        // Note: You'll need to import dayjs and convert strings to Dayjs objects
      }
    }
  },
  { deep: true },
)

// Expose methods to parent
defineExpose({
  resetFilters,
  refreshData,
  getSelectedRows: (): DataTableRecord[] => (props.rowSelection as any)?.selectedRows || [],
  getCurrentPageData: (): DataTableRecord[] => tableData.value,
  getSearchValue: (): string => searchValue.value,
  getDateRange: () => dateRangeValue.value,
})
</script>
