import type { PaginatingParams } from "@/types";
import request from '@/common/http-client'
import type { Role, RoleListData } from "@/types/roles";



export class RoleService {
    // 🔹 Get paginated role list
    static getRoleList(params: PaginatingParams) {
        return request.get<RoleListData>({
            url: '/roles/search',
            params,
        })
    }

    // 🔹 Create role
    static createRole(payload: Partial<Role>) {
        return request.post<Role>({
            url: '/roles',
            data: payload,
        })
    }

    // 🔹 Update role
    static updateRole(id: string, payload: Partial<Role>) {
        return request.put<Role>({
            url: `/roles/${id}`,
            data: payload,
        })
    }

    // 🔹 Delete role
    static deleteRole(id: string) {
        return request.del<void>({
            url: `/roles/${id}`,
        })
    }


}