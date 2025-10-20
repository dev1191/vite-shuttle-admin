import request from '@/common/http-client'
import type { OptionLists, PaginatingParams, SearchParams } from '@/types'
import type { DriverListData, Driver, DriverStatus } from '@/types/drivers'
import { toFormData } from 'axios'


export class DriverService {
    // 🔹 Get paginated Driver list
    static getDriverList(params: PaginatingParams) {
        return request.get<DriverListData>({
            url: '/drivers',
            params,
        })
    }

    static fetchDriverOptions(params: SearchParams) {
        return request.get<OptionLists>({
            url: '/drivers',
            params,
        })
    }


    // 🔹 Create Driver
    static createDriver(payload: Partial<Driver>) {
        const formData = toFormData(payload)
        return request.post<Driver>({
            url: '/drivers',
            data: formData,
        })
    }

    // 🔹 Update Driver
    static updateDriver(id: string, payload: Partial<Driver>) {
        return request.patch<Driver>({
            url: `/drivers/${id}`,
            data: payload,
        })
    }

    // 🔹 Update Driver
    static updateDriverStatus(id: string, payload: Partial<DriverStatus>) {
        return request.patch<Driver>({
            url: `/drivers/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete Driver
    static deleteDriver(id: string) {
        return request.del<void>({
            url: `/drivers/${id}`,
            showSuccessMessage: true
        })
    }
}