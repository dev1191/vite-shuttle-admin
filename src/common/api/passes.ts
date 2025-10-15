import request from '@/common/http-client'
import type { OptionLists, PaginatingParams, SearchParams } from '@/types'
import type { PassListData, Pass, Countriestatus } from '@/types/passes'


export class CountrieService {
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
    static updateCountriestatus(id: string, payload: Partial<Countriestatus>) {
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