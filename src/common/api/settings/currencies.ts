import request from '@/common/http-client'
import type { PaginatingParams } from '@/types'
import type { CurrencyListData, Currency, Countriestatus } from '@/types/currencies'


export class CountrieService {
    // 🔹 Get paginated country list
    static getCurrencyList(params: PaginatingParams) {
        return request.get<CurrencyListData>({
            url: '/currencies/search',
            params,
        })
    }


    // 🔹 Create country
    static createCurrency(payload: Partial<Currency>) {
        return request.post<Currency>({
            url: '/currencies',
            data: payload,
        })
    }

    // 🔹 Update country
    static updateCurrency(id: string, payload: Partial<Currency>) {
        return request.patch<Currency>({
            url: `/currencies/${id}`,
            data: payload,
        })
    }

    // 🔹 Update country
    static updateCountriestatus(id: string, payload: Partial<Countriestatus>) {
        return request.patch<Currency>({
            url: `/currencies/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete country
    static deleteCurrency(id: string) {
        return request.del<void>({
            url: `/currencies/${id}`,
            showSuccessMessage: true
        })
    }
}