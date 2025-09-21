// stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { jwtDecode } from 'jwt-decode'
// import { axiosWrapper } from '@/utils/axios' // adjust import path
// import { getProfile } from '@/api/user'       // adjust import path
// import { useUserStore } from './user'
// import { usePermissionStore } from './permission'
// import { useRoleStore } from './role'

export const useAuthStore = defineStore('auth', () => {
    // --- state ---
    const accessToken = ref<string>('')
    const expiresIn = ref<number>(0)
    const tokenType = ref<string>('')
    const refreshToken = ref<string>('')
    const isLoggedIn = ref<boolean>(false)

    // --- actions ---
    function setToken(data: Token) {
        accessToken.value = data.accessToken
        expiresIn.value = data.expiresIn
        refreshToken.value = data.refreshToken
        tokenType.value = data.tokenType
        isLoggedIn.value = true
    }

    function removeToken() {
        // const { removeUser } = useUserStore()
        //  const { removePermissions } = usePermissionStore()
        accessToken.value = ''
        expiresIn.value = 0
        refreshToken.value = ''
        tokenType.value = ''
        isLoggedIn.value = false
        // removeUser() // remove login user data
        // removePermissions() // remove permission
        //  delete axiosWrapper.defaults.headers.common['Authorization']
    }

    // async function getUser() {
    //     try {
    //         const userDecode: any = jwtDecode(accessToken.value)
    //         const { data } = await getProfile(userDecode.sub)
    //         const userStore = useUserStore()
    //         userStore.addUser(data)
    //         await UacPermissions(userDecode.roleId)
    //     } catch (error: any) {
    //         alert(error.message)
    //     }
    // }

    // async function checkRefreshToken() {
    //     try {
    //         console.log('------------- refresh token ----------')
    //         const { addUser, email } = useUserStore()
    //         const getResponse = await axiosWrapper.post('/auth/refresh-token', {
    //             email,
    //             refreshToken: refreshToken.value,
    //         })
    //         addUser(getResponse.data.user)
    //         accessToken.value = getResponse.data.token.accessToken
    //         expiresIn.value = getResponse.data.token.expiresIn
    //         refreshToken.value = getResponse.data.token.refreshToken
    //         tokenType.value = getResponse.data.token.tokenType
    //     } catch (error: any) {
    //         if (error?.response?.data?.message) {
    //             removeToken()
    //         } else alert(error.message)
    //     }
    // }

    // async function UacPermissions(roleId: string) {
    //     try {
    //         const { setPermissions } = usePermissionStore()
    //         const getPerms = await axiosWrapper.post('/auth/access', { roleId })
    //         setPermissions(getPerms.data.permissions)

    //         const { setRoles } = useRoleStore()
    //         setRoles(getPerms.data.roles)
    //     } catch (error: any) {
    //         if (error?.response?.data?.message) {
    //             removeToken()
    //         } else alert(error.message)
    //     }
    // }

    return {
        // state
        accessToken,
        expiresIn,
        tokenType,
        refreshToken,
        isLoggedIn,
        // actions
        setToken,
        removeToken,
        // getUser,
        // checkRefreshToken,
        // UacPermissions,
    }
}, {
    persist: true,
})
