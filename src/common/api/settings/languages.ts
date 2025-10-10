import request from '@/common/http-client'
import type { PaginatingParams } from '@/types'
import type { LanguageListData, Language, Languagestatus } from '@/types/settings/languages'


export class LanguageService {
    // 🔹 Get paginated country list
    static getLanguageList(params: PaginatingParams) {
        return request.get<LanguageListData>({
            url: '/languages/search',
            params,
        })
    }


    // 🔹 Create country
    static createLanguage(payload: Partial<Language>) {
        return request.post<Language>({
            url: '/languages',
            data: payload,
        })
    }

    // 🔹 Update country
    static updateLanguage(id: string, payload: Partial<Language>) {
        return request.patch<Language>({
            url: `/languages/${id}`,
            data: payload,
        })
    }

    // 🔹 Update country
    static updateCountriestatus(id: string, payload: Partial<Languagestatus>) {
        return request.patch<Language>({
            url: `/languages/${id}/status`,
            data: payload
        })
    }

    // 🔹 Delete country
    static deleteLanguage(id: string) {
        return request.del<void>({
            url: `/languages/${id}`,
            showSuccessMessage: true
        })
    }
}