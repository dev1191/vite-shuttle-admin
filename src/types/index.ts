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

export interface Range {
  start: string;
  end: string;
}
//?globalSearch&itemsPerPage=10&page=1&sortDesc=name&sortBy=desc
export interface PaginatingParams {
  globalSearch: string;
  itemsPerPage: number;
  page: number;
  sortDesc: string;
  sortBy: string
  status?: string
  range?: Range

}