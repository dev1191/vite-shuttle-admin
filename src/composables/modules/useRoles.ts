import type { Ref } from 'vue'
import type { PaginatingParams } from '@/types'
import { RoleService } from '@/common/api/role'
import type { Role } from '@/types/roles'

const { getRoleList, createRole, updateRole, deleteRole } = RoleService // api roles call

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

export const useRoles = (opts?: { pagination?: Ref<PaginatingParams> }) => {
    const roles = ref<Role[]>([])
    const isLoading = ref(false)
    const pagination = opts?.pagination ?? makePaginationRef()

    // 🔹 Fetch role list
    const fetchRoles = async () => {
        try {
            isLoading.value = true
            const params = unref(pagination)
            const response = await getRoleList(params)

            roles.value = response.items ?? []
            pagination.value.totalRecords = response.totalRecords
            pagination.value.page = response.page
            pagination.value.itemsPerPage = response.limit
            isLoading.value = false
        } catch (error) {
            console.error('Failed to fetch roles:', error)
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Create new role
    const addRole = async (payload: Partial<Role>) => {
        try {
            isLoading.value = true
            const response = await createRole(payload)
            roles.value.unshift(response.data) // insert at top
            return response.data
        } catch (error) {
            console.error('Failed to create role:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Update existing role
    const editRole = async (id: string, payload: Partial<Role>) => {
        try {
            isLoading.value = true
            const response = await updateRole(id, payload)
            const idx = roles.value.findIndex(u => u.id === id)
            if (idx !== -1) roles.value[idx] = response.data
            return response.data
        } catch (error) {
            console.error('Failed to update role:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Delete role
    const removeRole = async (id: string) => {
        try {
            isLoading.value = true
            await deleteRole(id)
            roles.value = roles.value.filter(u => u.id !== id)
        } catch (error) {
            console.error('Failed to delete role:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }


    return {
        roles,
        pagination,
        isLoading,
        fetchRoles,
        addRole,
        editRole,
        removeRole,
    }
}
