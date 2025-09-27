import * as Users from './users'
import * as Menu from "./menu";


export interface LoginResponse {
  token: string
  expiresIn: number
  refreshToken: string
  tokenType: string
}


export interface AccessResponse {
  permissions: string[],
  role: string[],
  generalSetting: any
}