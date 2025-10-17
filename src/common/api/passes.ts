import request from '@/common/http-client'
import type { OptionLists, PaginatingParams, SearchParams } from '@/types'
import type { PassListData, Pass, Passestatus, PassStatus } from '@/types/passes'


export class PassService {
    // 🔹 Get paginated country list
    static getPassList(params: PaginatingParams) {
        return request.get<PassListData>({
            url: '/passes/search',
            params,
        })
    }

    static fetchPassOptions(params: SearchParams) {
        return request.get<OptionLists>({
            url: '/passes',
            params,
        })
    }


    // 🔹 Create country
    static createPass(payload: Partial<Pass>) {
        return request.post<Pass>({
            url: '/passes',
            data: payload,
        })
    }

    // 🔹 Update country
    static updatePass(id: string, payload: Partial<Pass>) {
        return request.patch<Pass>({
            url: `/passes/${id}`,
            data: payload,
        })
    }

    // 🔹 Update country
    static updatePassStatus(id: string, payload: Partial<PassStatus>) {
        return request.patch<Pass>({
            url: `/passes/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete country
    static deletePass(id: string) {
        return request.del<void>({
            url: `/passes/${id}`,
            showSuccessMessage: true
        })
    }
}