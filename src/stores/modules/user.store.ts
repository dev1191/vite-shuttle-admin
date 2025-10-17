import type { GeneralSetting } from '@/types'
import type { Permission, Role } from '@/types/roles'
import type { User } from '@/types/users'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    // state
    const user = ref<User | null>(null)
    const generalSetting = ref<GeneralSetting>({
      name: "",
      tagline: "",
      email: "",
      phone: "",
      address: "",
      dark_logo: "",
      white_logo: "",
      favicon: "",
    })
    const appSetting = ref({
      default_currency: '',
      default_country: '',
      default_language: '',
      timezone: '',
      date_format: '',
      time_format: '',
      tax: {},
      commission: {}
    })
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
      appSetting.value = accessData.appSetting
    }

    function clearUser() {
      user.value = null
      clearAccess() // clear access when user logout
    }

    function clearAccess() {
      roles.value = [];
      permissions.value = [];
      clearGeneral()
    }
    function clearGeneral() {
      generalSetting.value = {
        name: "",
        tagline: "",
        email: "",
        phone: "",
        address: "",
        dark_logo: "",
        white_logo: "",
        favicon: "",
      }
      appSetting.value = {
        default_currency: '',
        default_country: '',
        default_language: '',
        timezone: '',
        date_format: '',
        time_format: '',
        tax: {},
        commission: {}
      }
    }

    function setGeneral(formData: any) {
      generalSetting.value = formData
    }

    function setApp(formData: any) {
      appSetting.value = formData
    }
    // getters
    const fullName = computed(() =>
      user.value ? `${user.value.firstname} ${user.value.lastname}` : '',
    )

    function hasPermission(perm: string) {
      permissions.value?.some((p) => p.slug === perm) ?? false
    }


    return {
      user,
      roles,
      permissions,
      generalSetting,
      appSetting,
      setUser,
      setAccess,
      clearUser,
      clearAccess,
      fullName,
      hasPermission,
      setGeneral,
      setApp
    }
  },
  {
    persist: true,
  },
)
