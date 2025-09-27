<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
import type { TableColumnType, TableProps } from 'ant-design-vue'

// Types
export interface DataTableColumn extends TableColumnType {
  key: string
  dataIndex?: string
  title: string
  scopedSlots?: boolean
  sortable?: boolean
}

export interface DataTableRecord {
  [key: string]: any
  id?: string | number
}

export interface PaginationConfig {
  current?: number
  pageSize?: number
  total?: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => string
}

export interface TableChangeEvent {
  pagination: {
    current: number
    pageSize: number
  }
  filters: Record<string, any>
  sorter: Record<string, any>
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
  pagination?: PaginationConfig | false
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: string[]
  rowSelection?: TableProps['rowSelection']
  remote?: boolean
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
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  }),
  searchable: true,
  searchPlaceholder: 'Search...',
  searchKeys: () => [],
  rowSelection: null,
  remote: false,
})

// Emits
const emit = defineEmits<{
  change: [event: TableChangeEvent]
  search: [value: string]
  expand: [expanded: boolean, record: DataTableRecord]
  'selection-change': [selectedRowKeys: (string | number)[], selectedRows: DataTableRecord[]]
}>()

// Reactive data
const searchValue = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const sorter = ref<Record<string, any>>({})
const filters = ref<Record<string, any>>({})

// Computed properties
const processedColumns = computed<DataTableColumn[]>(() => {
  return props.columns.map((column) => ({
    ...column,
    ...(column.sortable !== false && column.sorter === undefined ? { sorter: true } : {}),
  }))
})

const columnsWithSlots = computed<DataTableColumn[]>(() => {
  return props.columns.filter((column) => column.scopedSlots)
})

const processedData = computed<DataTableRecord[]>(() => {
  if (props.remote) {
    return props.data
  }

  let filtered = [...props.data]

  // Apply search filter
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

  // Apply column filters
  if (Object.keys(filters.value).length > 0 && !props.remote) {
    Object.keys(filters.value).forEach((key) => {
      const filterValue = filters.value[key]
      if (filterValue && filterValue.length > 0) {
        filtered = filtered.filter((item) => {
          const value = getNestedValue(item, key)
          return filterValue.includes(value)
        })
      }
    })
  }

  return filtered
})

const paginationConfig = computed<PaginationConfig | false>(() => {
  if (props.pagination === false) return false

  const defaultPagination: PaginationConfig = {
    current: currentPage.value,
    pageSize: pageSize.value,
    total: processedData.value.length,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  }

  return {
    ...defaultPagination,
    ...props.pagination,
  }
})

// Methods
const getNestedValue = (obj: Record<string, any>, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const handleTableChange = (
  pagination: any,
  tableFilters: Record<string, any>,
  tableSorter: any,
  { action }: { action: string },
): void => {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize

  if (action === 'sort') {
    sorter.value = tableSorter
  }

  if (action === 'filter') {
    filters.value = tableFilters
  }

  emit('change', {
    pagination: {
      current: currentPage.value,
      pageSize: pageSize.value,
    },
    filters: filters.value,
    sorter: sorter.value,
    action,
  })
}

const onSearch = (): void => {
  currentPage.value = 1 // Reset to first page when searching
  emit('search', searchValue.value)
}

const handleExpand = (expanded: boolean, record: DataTableRecord): void => {
  emit('expand', expanded, record)
}

const resetFilters = (): void => {
  searchValue.value = ''
  filters.value = {}
  sorter.value = {}
  currentPage.value = 1
}

const refreshData = (): void => {
  emit('change', {
    pagination: {
      current: currentPage.value,
      pageSize: pageSize.value,
    },
    filters: filters.value,
    sorter: sorter.value,
    action: 'refresh',
  })
}

// Watch for external pagination changes
watch(
  () => props.pagination,
  (newPagination) => {
    if (newPagination && typeof newPagination === 'object') {
      if (newPagination.current !== undefined) {
        currentPage.value = newPagination.current
      }
      if (newPagination.pageSize !== undefined) {
        pageSize.value = newPagination.pageSize
      }
    }
  },
  { immediate: true },
)

// Expose methods to parent
defineExpose({
  resetFilters,
  refreshData,
  getSelectedRows: (): DataTableRecord[] => (props.rowSelection as any)?.selectedRows || [],
  getCurrentPageData: (): DataTableRecord[] => processedData.value,
})

// Initialize
onMounted(() => {
  if (props.pagination && typeof props.pagination === 'object') {
    currentPage.value = props.pagination.current || 1
    pageSize.value = props.pagination.pageSize || 10
  }
})
</script>

<template>
  <div class="p-2">
    <!-- Header with title and actions -->
    <div class="flex justify-between items-center mb-4" v-if="title || $slots.headerActions">
      <h3 v-if="title" class="m-0 text-lg font-semibold text-gray-800">{{ title }}</h3>
      <div class="flex gap-2">
        <slot name="headerActions"></slot>
      </div>
    </div>

    <!-- Search and filters -->
    <div
      class="flex justify-between items-center mb-4 gap-4 md:flex-row flex-col md:items-center items-stretch"
      v-if="searchable || $slots.filters"
    >
      <a-input
        v-if="searchable"
        v-model:value="searchValue"
        :placeholder="searchPlaceholder"
        allow-clear
        class="max-w-75 md:max-w-75 w-full"
        @change="onSearch"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <div class="flex gap-2 items-center flex-wrap md:justify-start justify-start">
        <slot name="filters"></slot>
      </div>
    </div>

    <!-- Data Table -->
    <a-table
      :columns="processedColumns"
      :data-source="processedData"
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
    </a-table>
  </div>
</template>
