import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { UserService } from '@/common/api/user'
import type { User } from '@/types/users'

const { getUserList, createUser, updateUser, deleteUser } = UserService // api users call

// Default pagination
const makePaginationRef = () =>
    ref<PaginatingParams>({
        page: 1,
        itemsPerPage: 10,
        globalSearch: '',
        sortBy: 'createdAt',
        sortDesc: 'desc',
        range: { start: '', end: '' },
    })

export const useUsers = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const users = ref<User[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch user list
    const fetchUsers = async () => {
        try {
            isLoading.value = true
            const params = unref(pagination)
            const response = await getUserList(params)

            users.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
            isLoading.value = false
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Create new user
    const addUser = async (payload: Partial<User>) => {
        try {
            isLoading.value = true
            const response = await createUser(payload)
            users.value.unshift(response.data) // insert at top
            return response.data
        } catch (error) {
            console.error('Failed to create user:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing user
    const editUser = async (id: string, payload: Partial<User>) => {
        try {
            isLoading.value = true
            const response = await updateUser(id, payload)
            const idx = users.value.findIndex(u => u.id === id)
            if (idx !== -1) users.value[idx] = response.data
            return response.data
        } catch (error) {
            console.error('Failed to update user:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete user
    const removeUser = async (id: string) => {
        try {
            isLoading.value = true
            await deleteUser(id)
            users.value = users.value.filter(u => u.id !== id)
        } catch (error) {
            console.error('Failed to delete user:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }


    return {
        users,
        pagination,
        isLoading,
        fetchUsers,
        addUser,
        editUser,
        removeUser,
    }
}
