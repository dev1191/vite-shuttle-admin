<script setup>
import { useAuthStore } from '@/stores/modules/auth.store'
import { useUserStore } from '@/stores/modules/user.store'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// Icons from Ant Design Vue
import {
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons-vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const userInfo = computed(() => userStore.user)
const currentRole = computed(() => userInfo.value?.role.toLocaleLowerCase() || 'admin')
const userAvatar = computed(() => userInfo.value?.picture || '/assets/images/profiles/default.png')

const logout = () => {
  authStore.removeToken()
  userStore.clearUser()
}
</script>

<template>
  <a-dropdown
    trigger="hover"
    placement="bottomRight"
    :overlayStyle="{ width: '240px', padding: '4px 10px 4px 10px' }"
  >
    <template #overlay>
      <a-menu>
        <!-- Profile -->
        <a-menu-item key="profile" @click="router.push({ path: `/${currentRole}/profile` })">
          <template #icon>
            <UserOutlined :style="{ fontSize: '14px' }" />
          </template>
          {{ t('settings.profile') }}
        </a-menu-item>

        <!-- Settings -->
        <a-menu-item
          key="settings"
          @click="router.push({ path: `/${currentRole}/settings/general` })"
        >
          <template #icon>
            <SettingOutlined :style="{ fontSize: '14px' }" />
          </template>
          {{ t('settings.title') }}
        </a-menu-item>

        <a-menu-divider class="m-2" />

        <!-- Logout -->
        <a-menu-item key="logout" @click="logout">
          <template #icon>
            <LogoutOutlined :style="{ fontSize: '14px' }" />
          </template>
          {{ t('settings.logout') }}
        </a-menu-item>
      </a-menu>
    </template>

    <!-- Avatar trigger -->
    <a-avatar :src="userAvatar" :alt="userStore.fullName" class="cursor-pointer">
      {{ userStore.fullName?.charAt(0).toUpperCase() }}
    </a-avatar>
  </a-dropdown>
</template>

<style scoped></style>
