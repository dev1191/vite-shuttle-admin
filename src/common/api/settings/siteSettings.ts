import request from '@/common/http-client'
import { toFormData } from 'axios'


export class SiteSettingService {



    static fetch(name: string) {
        return request.get<Record<string, any>>({
            url: `/settings/${name}`,
        })
    }

    static update(name: string, payload: any) {
        return request.patch<Record<string, any>>({
            url: `/settings/${name}`,
            data: name === 'general' || name === 'notifications' ? toFormData(payload) : payload,
        })
    }
}