import * as Users from './users'
import * as Menu from "./menu";
import * as Country from "./settings/countries";
import * as Currency from "./settings/currencies";

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
  timezone: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  default_country: string;
  default_currency: string;
  default_currency_code: string;
  default_language: string;
  google_key: string;
  tax: string;
  fee: string;
  date_format: {
    text: string;
    value: string;
  },
  time_format: {
    text: string;
    value: string;
  },
  background_location_update_interval: number;
  driver_online_location_update_interval: number;
  max_distance: number;
  prebooking_time: number;
  distance_unit: string;
  dark_logo: string;
  light_logo: string;
  favicon: string;
}