import request from '@/common/http-client'
import type { OptionLists, PaginatingParams, SearchParams } from '@/types'
import type { OperatorListData, Operator, OperatorStatus } from '@/types/operators'
import { toFormData } from 'axios'


export class OperatorService {
    // 🔹 Get paginated Operator list
    static getOperatorList(params: PaginatingParams) {
        return request.get<OperatorListData>({
            url: '/operators',
            params,
        })
    }

    static fetchOperatorOptions(params: SearchParams) {
        return request.get<OptionLists>({
            url: '/operators',
            params,
        })
    }


    // 🔹 Create Operator
    static createOperator(payload: Partial<Operator>) {
        const formData = toFormData(payload)
        return request.post<Operator>({
            url: '/operators',
            data: formData,
        })
    }

    // 🔹 Update Operator
    static updateOperator(id: string, payload: Partial<Operator>) {
        const formData = toFormData(payload)
        return request.patch<Operator>({
            url: `/operators/${id}`,
            data: formData,
        })
    }

    // 🔹 Update Operator
    static updateOperatorStatus(id: string, payload: Partial<OperatorStatus>) {
        return request.patch<Operator>({
            url: `/operators/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete Operator
    static deleteOperator(id: string) {
        return request.del<void>({
            url: `/operators/${id}`,
            showSuccessMessage: true
        })
    }
}