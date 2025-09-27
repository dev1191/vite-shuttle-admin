import request from '@/common/http-client'
import type { PaginatingParams } from '@/types'
import type { UserListData } from '@/types/users'

export class UserService {

    static getUserList(params: PaginatingParams) {
        return request.get<UserListData>({
            url: '/admin-users/search',
            params
        })
    }
}