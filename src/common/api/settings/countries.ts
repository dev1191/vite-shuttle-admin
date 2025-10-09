import request from '@/common/http-client'
import type { PaginatingParams } from '@/types'
import type { CountryListData, Country, Countriestatus } from '@/types/countries'
import { toFormData } from '@/utils'


export class Countrieservice {
    // 🔹 Get paginated country list
    static getCountryList(params: PaginatingParams) {
        return request.get<CountryListData>({
            url: '/countries/search',
            params,
        })
    }


    // 🔹 Create country
    static createCountry(payload: Partial<Country>) {
        return request.post<Country>({
            url: '/countries',
            data: payload,
        })
    }

    // 🔹 Update country
    static updateCountry(id: string, payload: Partial<Country>) {
        return request.patch<Country>({
            url: `/countries/${id}`,
            data: payload,
        })
    }

    // 🔹 Update country
    static updateCountriestatus(id: string, payload: Partial<Countriestatus>) {
        return request.patch<Country>({
            url: `/countries/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete country
    static deleteCountry(id: string) {
        return request.del<void>({
            url: `/countries/${id}`,
            showSuccessMessage: true
        })
    }
}