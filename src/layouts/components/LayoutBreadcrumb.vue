<script setup lang="ts">
import { HomeOutlined, UserOutlined } from '@ant-design/icons-vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
</script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item href="">
      <home-outlined />
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in route.meta.breadcrumb as string[]" :key="item">
      {{ t(`menu.${item}`) }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style scoped>
.layout-breadcrumb {
  :deep(.ant-breadcrumb) {
    .ant-breadcrumb-link {
      color: var(--breadcrumb-color);
    }
    .ant-dropdown-trigger {
      .ant-breadcrumb-link {
        color: var(--breadcrumb-overlay-color);
      }
    }
    .ant-breadcrumb-separator,
    .anticon {
      color: var(--breadcrumb-overlay-color);
    }
  }
}
</style>
