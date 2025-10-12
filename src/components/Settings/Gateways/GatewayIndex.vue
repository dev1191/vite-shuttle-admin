<script setup lang="ts">
import type { Gateway } from '@/types'

const { t } = useI18n()

const props = defineProps({
  gateways: {
    type: Array as PropType<Gateway[]>,
    default: [],
  },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (event: 'edit-gateway', data: Gateway): void
}>()

const searchValue = ref('')

const filteredPayments = computed(() => {
  const value = searchValue.value.trim().toLowerCase()
  if (value.length === 0) {
    return props.gateways
  }
  return props.gateways.filter((gateway) => gateway.site.toLowerCase().includes(value))
})
</script>

<template>
  <div>
    <a-input size="large" v-model:value="searchValue" class="mb-4" placeholder="Search">
      <template #prefix>
        <Icon color="secondary" name="hugeicons:search-01" />
      </template>
    </a-input>

    <section
      v-if="filteredPayments.length || loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5"
    >
      <!-- Loading Skeletons -->
      <template v-if="loading">
        <div
          v-for="i in 9"
          :key="i"
          class="min-h-[150px] p-4 rounded-lg border-2 border-dashed border-primary flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div class="flex flex-col gap-2 flex-grow w-full">
            <div class="flex justify-between items-center">
              <a-skeleton active :paragraph="{ rows: 1, width: '100px' }" :title="false" />
              <a-skeleton active :paragraph="{ rows: 1, width: '60px' }" :title="false" />
            </div>
            <div class="flex gap-4">
              <a-skeleton-image style="width: 120px; height: 40px" />
              <a-skeleton active :paragraph="{ rows: 1, width: '64px' }" :title="false" />
            </div>
          </div>
        </div>
      </template>

      <!-- Real Gateway Cards -->
      <template v-else v-for="category in filteredPayments" :key="category.id">
        <a-badge-ribbon
          :text="category.data.is_enabled === '1' ? t('common.active') : t('common.inactive')"
          :color="category.data.is_enabled === '1' ? 'success' : 'red'"
        >
          <a-card
            hoverable
            :bordered="false"
            :title="category.site"
            class="mb-4 min-h-[150px]"
            :body-style="{ padding: '16px' }"
          >
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <!-- Left content -->
              <div class="flex flex-col gap-2 flex-grow">
                <a-image
                  :width="120"
                  fill="cover"
                  :ratio="16 / 9"
                  :src="`/public/payments/${category.site}.png`"
                />
              </div>

              <!-- Right content -->
              <div class="w-full sm:w-auto flex-none flex sm:block">
                <a-button
                  type="primary"
                  class="flex-grow"
                  @click="emit('edit-gateway', category as Gateway)"
                >
                  {{ t('common.edit') }}
                </a-button>
              </div>
            </div>
          </a-card>
        </a-badge-ribbon>
      </template>
    </section>

    <div v-else class="text-center text-gray-500 py-6">
      {{ t('common.noDataFound') }}
    </div>
  </div>
</template>
