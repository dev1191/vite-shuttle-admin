

import * as Users from "./users"



export interface LoginResponse {
    accessToken: string
    expiresIn: number
    refreshToken: string
    tokenType: string
}