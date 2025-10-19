import request from '@/common/http-client'

export class SendMessageService {
    static testMail(payload: Partial<{ mail: string }>) {
        return request.post<Record<string, any>>({
            url: '/send-message/test',
            data: payload,
        })
    }

}