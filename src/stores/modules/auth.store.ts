import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserProfile } from '@/types/users'

interface Token {
    accessToken: string
    expiresIn: number
    tokenType: string
    refreshToken: string
    LoggedIn: boolean
}



export const useAuthStore = defineStore('auth', () => {
    const user = ref<UserProfile | null>(null)

    const LoggedIn = computed(() => !!user.value)

    function login(email: string, password: string) {
        user.value = {
            id: '1',
            email: 'user@example.com',
            avatar: 'https://example.com/avatar.jpg',
            roleId: '1',
            role: 'User',
            permissions: []
        }
    }

    function logout() {
        user.value = null
    }

    return { user, LoggedIn, login, logout }
})
