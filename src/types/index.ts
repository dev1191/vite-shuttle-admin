import * as Users from './users'

export interface LoginResponse {
  token: string
  expiresIn: number
  refreshToken: string
  tokenType: string
}
