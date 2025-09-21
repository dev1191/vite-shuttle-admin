import request from '@/common/http-client'
import type { LoginResponse } from '@/types';



export function fetchLogin(params: { email: string; password: string }) {
    return request.post<LoginResponse>({
        url: '/auth/login',
        params
        // showSuccessMessage: true // 显示成功消息
        // showErrorMessage: false // 不显示错误消息
    })
}