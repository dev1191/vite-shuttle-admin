<script setup lang="ts">
import { useLayoutSettingStore } from '@/stores/modules/layout.store'

const layoutThemeStore = useLayoutSettingStore()
const copyright = computed(() => layoutThemeStore.layoutSetting.copyright)
</script>

<template>
  <div class="footer">
    <!-- <div class="links">
      <a
        target="_blank"
        :key="index"
        :href="item.link ? item.link : 'javascript: void(0)'"
        v-for="(item, index) in linkList"
      >
        <a-icon v-if="item.icon" :type="item.icon" />{{ item.name }}
      </a>
    </div> -->
    <div class="copyright">Copyright<a-icon type="copyright" />{{ copyright }}</div>
  </div>
</template>

<style scoped>
.footer {
  padding: 48px 16px 24px;
  /*margin: 48px 0 24px;*/
  text-align: center;
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    i {
      margin: 0 4px;
    }
  }
}
</style>
