import request from '@/common/http-client'
import type { PaginatingParams } from '@/types'
import type { UserListData, User } from '@/types/users'
import { toFormData } from '@/utils'


export class UserService {
    // 🔹 Get paginated user list
    static getUserList(params: PaginatingParams) {
        return request.get<UserListData>({
            url: '/admin-users/search',
            params,
        })
    }

    // 🔹 Create user
    static createUser(payload: Partial<User>) {
        return request.post<User>({
            url: '/admin-users',
            data: payload,
        })
    }

    // 🔹 Update user
    static updateUser(id: string, payload: Partial<User>) {
        const formData = toFormData(payload)
        return request.put<User>({
            url: `/admin-users/${id}`,
            data: formData,
        })
    }

    // 🔹 Delete user
    static deleteUser(id: string) {
        return request.del<void>({
            url: `/admin-users/${id}`,
        })
    }
}
