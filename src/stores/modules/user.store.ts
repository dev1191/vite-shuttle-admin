import type { GeneralSetting } from '@/types'
import type { Permission, Role } from '@/types/roles'
import type { User } from '@/types/users'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    // state
    const user = ref<User | null>(null)
    const generalSetting = ref<GeneralSetting>({})
    const roles = ref<Role[]>([]);
    const permissions = ref<Permission[]>([]);
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
      permissions.value?.some((p) => p.slug === perm) ?? false

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
