import request from '@/common/http-client'
import type { LoginResponse, AccessResponse, RefreshResponse } from '@/types'
import type { User } from '@/types/users'

export function fetchLogin(params: { email: string; password: string }) {
  return request.post<LoginResponse>({
    url: '/auth/login',
    params,
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}

export function fetchRefreshToken(params: { email: string; refreshToken: string }) {
  return request.post<RefreshResponse>({
    url: '/auth/refresh-token',
    params,
    // showSuccessMessage: true // 显示成功消息
    // showErrorMessage: false // 不显示错误消息
  })
}



export function getProfile() {
  return request.get<User>({ url: `/admin/me` })
}

export function getAccess() {
  return request.get<AccessResponse>({ url: `/admin/access` })
}
