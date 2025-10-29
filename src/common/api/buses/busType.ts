import request from '@/common/http-client'
import type { OptionLists, PaginatingParams, SearchParams } from '@/types'
import type { BusTypeListData, BusType, BusTypeStatus } from '@/types/busTypes'
import { toFormData } from 'axios'


export class BusTypeService {
    // 🔹 Get paginated BusType list
    static getBusTypeList(params: PaginatingParams) {
        return request.get<BusTypeListData>({
            url: '/bustypes/search',
            params,
        })
    }

    static fetchBusTypeOptions(params: SearchParams) {
        return request.get<OptionLists>({
            url: '/bustypes',
            params,
        })
    }


    // 🔹 Create BusType
    static createBusType(payload: Partial<BusType>) {
        const formData = toFormData(payload)
        return request.post<BusType>({
            url: '/bustypes',
            data: formData,
        })
    }

    // 🔹 Update BusType
    static updateBusType(id: string, payload: Partial<BusType>) {
        return request.patch<BusType>({
            url: `/bustypes/${id}`,
            data: payload,
        })
    }

    // 🔹 Update BusType
    static updateBusTypeStatus(id: string, payload: Partial<BusTypeStatus>) {
        return request.patch<BusType>({
            url: `/bustypes/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete BusType
    static deleteBusType(id: string) {
        return request.del<void>({
            url: `/bustypes/${id}`,
            showSuccessMessage: true
        })
    }


    // 🔹 Check if email or phone exists
    static checkExists(params: { email?: string; phone?: string, isEditable?: boolean }) {
        return request.get<{ type: 'email' | 'phone'; exists: boolean }>({
            url: '/bustypes/check-exists',
            params,
        })
    }
}