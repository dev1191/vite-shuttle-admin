import request from '@/common/http-client'
import type { OptionLists, PaginatingParams, SearchParams } from '@/types'
import type { OfferListData, Offer, OfferStatus } from '@/types/offers'
import { toFormData } from 'axios'


export class OfferService {
    // 🔹 Get paginated country list
    static getOfferList(params: PaginatingParams) {
        return request.get<OfferListData>({
            url: '/offers/search',
            params,
        })
    }

    static fetchOfferOptions(params: SearchParams) {
        return request.get<OptionLists>({
            url: '/offers',
            params,
        })
    }


    // 🔹 Create country
    static createOffer(payload: Partial<Offer>) {
        const formData = toFormData(payload)
        return request.post<Offer>({
            url: '/offers',
            data: formData,
        })
    }

    // 🔹 Update country
    static updateOffer(id: string, payload: Partial<Offer>) {
        const formData = toFormData(payload)
        return request.patch<Offer>({
            url: `/offers/${id}`,
            data: formData,
        })
    }

    // 🔹 Update country
    static updateOfferStatus(id: string, payload: Partial<OfferStatus>) {
        return request.patch<Offer>({
            url: `/offers/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete country
    static deleteOffer(id: string) {
        return request.del<void>({
            url: `/offers/${id}`,
            showSuccessMessage: true
        })
    }
}