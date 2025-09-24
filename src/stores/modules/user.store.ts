import type { User } from '@/types/users'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    // state
    const user = ref<User | null>(null)
    const roles = ref<[]>([]);
    const permissions = ref<[]>([]);
    // actions
    function setUser(userData: User) {
      user.value = userData
    }

    function clearUser() {
      user.value = null
    }

    // getters
    const fullName = computed(() =>
      user.value ? `${user.value.firstname} ${user.value.lastname}` : '',
    )

    const hasPermission = (perm: string) =>
      user.value?.permissions?.some((p) => p.value === perm) ?? false

    return {
      user,
      roles,
      permissions,
      setUser,
      clearUser,
      fullName,
      hasPermission,
    }
  },
  {
    persist: true,
  },
)
