import request from '@/common/http-client'
import type { OptionLists, PaginatingParams, SearchParams } from '@/types'
import type { BusLayoutListData, BusLayout, BusLayoutStatus } from '@/types/busLayouts'
import { toFormData } from 'axios'


export class BusLayoutService {
    // 🔹 Get paginated BusLayout list
    static getBusLayoutList(params: PaginatingParams) {
        return request.get<BusLayoutListData>({
            url: '/buslayouts/search',
            params,
        })
    }

    static fetchBusLayoutOptions(params: SearchParams) {
        return request.get<OptionLists>({
            url: '/buslayouts',
            params,
        })
    }


    // 🔹 Create BusLayout
    static createBusLayout(payload: Partial<BusLayout>) {
        const formData = toFormData(payload)
        return request.post<BusLayout>({
            url: '/buslayouts',
            data: formData,
        })
    }

    // 🔹 Update BusLayout
    static updateBusLayout(id: string, payload: Partial<BusLayout>) {
        return request.patch<BusLayout>({
            url: `/buslayouts/${id}`,
            data: payload,
        })
    }

    // 🔹 Update BusLayout
    static updateBusLayoutStatus(id: string, payload: Partial<BusLayoutStatus>) {
        return request.patch<BusLayout>({
            url: `/buslayouts/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete BusLayout
    static deleteBusLayout(id: string) {
        return request.del<void>({
            url: `/buslayouts/${id}`,
            showSuccessMessage: true
        })
    }


    // 🔹 Check if email or phone exists
    static checkExists(params: { email?: string; phone?: string, isEditable?: boolean }) {
        return request.get<{ type: 'email' | 'phone'; exists: boolean }>({
            url: '/buslayouts/check-exists',
            params,
        })
    }
}