import type { User } from '@/types/users'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    // state
    const user = ref<User | null>(null)
    const generalSetting = ref({})
    const roles = ref<[]>([]);
    const permissions = ref<[]>([]);
    // actions
    function setUser(userData: User) {
      user.value = userData
    }

    function setAccess(accessData: any) {
      console.log("accessData", accessData)
      roles.value = accessData.roles;
      permissions.value = accessData.permissions;
      generalSetting.value = accessData.generalSetting;
    }

    function clearUser() {
      user.value = null
      clearAccess() // clear access when user logout
    }

    function clearAccess() {
      roles.value = [];
      permissions.value = [];
      generalSetting.value = {}
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
      generalSetting,
      setUser,
      setAccess,
      clearUser,
      clearAccess,
      fullName,
      hasPermission,
    }
  },
  {
    persist: true,
  },
)
