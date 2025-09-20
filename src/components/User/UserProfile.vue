<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userInfo = {
  email: 'user@example.com',
  avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
  logout: () => {
    console.log('Logged out')
  },
}

const logout = () => {
  userStore.logout()
}
</script>

<template>
  <a-dropdown>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="logout">{{ t('setting.logout') }}</a-menu-item>
      </a-menu>
    </template>
    <a-avatar :src="userInfo.avatar" :alt="userInfo.email">
      {{ userInfo.email }}
    </a-avatar>
  </a-dropdown>
</template>

<style scoped lang="less"></style>
