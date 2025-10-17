import request from '@/common/http-client'
import type { OptionLists, PaginatingParams, SearchParams } from '@/types'
import type { HelpAndSupportListData, HelpAndSupport, HelpAndSupportStatus } from '@/types/helpAndSupports'
import { toFormData } from 'axios'


export class HelpAndSupportService {
    // 🔹 Get paginated country list
    static getHelpAndSupportList(params: PaginatingParams) {
        return request.get<HelpAndSupportListData>({
            url: '/helpers/search',
            params,
        })
    }

    static fetchHelpAndSupportOptions(params: SearchParams) {
        return request.get<OptionLists>({
            url: '/helpers',
            params,
        })
    }




    // 🔹 Update country
    static updateHelpAndSupport(id: string, payload: Partial<HelpAndSupport>) {
        const formData = toFormData(payload)
        return request.patch<HelpAndSupport>({
            url: `/helpers/${id}`,
            data: formData,
        })
    }

    // 🔹 Update country
    static updateHelpAndSupportStatus(id: string, payload: Partial<HelpAndSupportStatus>) {
        return request.patch<HelpAndSupport>({
            url: `/helpers/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete country
    static deleteHelpAndSupport(id: string) {
        return request.del<void>({
            url: `/helpers/${id}`,
            showSuccessMessage: true
        })
    }
}