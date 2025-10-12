import request from '@/common/http-client'
import { toFormData } from '@/utils'

export class SiteSettingService {



    static fetch(name: string) {
        return request.get<Record<string, any>>({
            url: `/settings/${name}`,
        })
    }

    static update(name: string, payload: any) {
        const formData = toFormData(payload)
        return request.patch<Record<string, any>>({
            url: `/settings/${name}`,
            data: formData,
        })
    }
}