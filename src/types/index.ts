import * as Users from './users'
import * as Menu from "./menu";
import * as Country from "./settings/countries";
import * as Currency from "./settings/currencies";
import * as Pass from "./passes/index"

export interface LoginResponse {
  token: string
  expiresIn: number
  refreshToken: string
  tokenType: string
}

export interface RefreshResponse {
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


export interface OptionLists {
  id?: string
  value: string;
  label: string;
  phone_code?: string;
  short_name?: string;
}

export interface Gateway {
  site: string;
  data: any;
}

export interface SearchParams {
  search: string;
}

export interface Range {
  start: string;
  end: string;
}

export interface Filter {
  type: string;
  name: string;
  value: string | boolean | string[]
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
  totalRecords?: number
  filters: Filter

}

export interface GeneralSetting {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  dark_logo: string;
  white_logo: string;
  favicon: string;
}