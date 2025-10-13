import request from '@/common/http-client';
import type { Gateway } from '@/types';

export class GatewayService {


    static fetchGateways() {
        return request.get<Gateway>({
            url: '/gateways'
        })
    }


    static updateGateway(site: string, payload: Partial<Gateway>) {
        return request.patch<Gateway>({
            url: `/gateways/${site}`,
            data: payload,
        })
    }

}