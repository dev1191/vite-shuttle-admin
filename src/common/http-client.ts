import { useAuthStore } from '@/stores/modules/auth.store'
import axios, { type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { ApiStatus } from './status'
import { HttpError, handleError, showError, showSuccess } from './error'
import { $t } from '@/plugins/i18n'


const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

/**  */
let isUnauthorizedErrorShown = false
let unauthorizedTimer: NodeJS.Timeout | null = null

/** Request configuration constants */
const REQUEST_TIMEOUT = 15000
const LOGOUT_DELAY = 500
const MAX_RETRIES = 0
const RETRY_DELAY = 1000
const UNAUTHORIZED_DEBOUNCE_TIME = 3000

/**  AxiosRequestConfig */
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    showErrorMessage?: boolean
    showSuccessMessage?: boolean
}

const axiosInstance = axios.create({
    timeout: REQUEST_TIMEOUT,
    baseURL: VITE_API_URL,
    withCredentials: VITE_WITH_CREDENTIALS === 'true',
    validateStatus: (status) => status >= 200 && status < 300,
    transformResponse: [
        (data, headers) => {
            const contentType = headers['content-type']
            if (contentType?.includes('application/json')) {
                try {
                    return JSON.parse(data)
                } catch {
                    return data
                }
            }
            return data
        }
    ]
});


/** Request Interceptor */
axiosInstance.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => {
        const { accessToken } = useAuthStore()
        if (accessToken) request.headers.set('Authorization', accessToken)

        if (request.data && !(request.data instanceof FormData) && !request.headers['Content-Type']) {
            request.headers.set('Content-Type', 'application/json')
            request.data = JSON.stringify(request.data)
        }

        return request
    },
    (error) => {
        showError(createHttpError($t('httpMsg.requestConfigError'), ApiStatus.error))
        return Promise.reject(error)
    }
)

/** Response Interceptor */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse<Http.BaseResponse>) => {
        const { code, msg } = response.data
        if (code === ApiStatus.success) return response
        if (code === ApiStatus.unauthorized) handleUnauthorizedError(msg)
        throw createHttpError(msg || $t('httpMsg.requestFailed'), code)
    },
    (error) => {
        if (error.response?.status === ApiStatus.unauthorized) handleUnauthorizedError()
        return Promise.reject(handleError(error))
    }
)

/**HttpError */
function createHttpError(message: string, code: number) {
    return new HttpError(message, code)
}


/** 401 handle unauthorized */
function handleUnauthorizedError(message?: string): never {
    const error = createHttpError(message || $t('httpMsg.unauthorized'), ApiStatus.unauthorized)

    if (!isUnauthorizedErrorShown) {
        isUnauthorizedErrorShown = true
        logOut()

        unauthorizedTimer = setTimeout(resetUnauthorizedError, UNAUTHORIZED_DEBOUNCE_TIME)

        showError(error, true)
        throw error
    }

    throw error
}



function logOut() {
    setTimeout(() => {
        useAuthStore().removeToken()
    }, LOGOUT_DELAY)
}


/** Retry request */
async function retryRequest<T>(
    config: ExtendedAxiosRequestConfig,
    retries: number = MAX_RETRIES
): Promise<T> {
    try {
        return await request<T>(config)
    } catch (error) {
        if (retries > 0 && error instanceof HttpError && shouldRetry(error.code)) {
            await delay(RETRY_DELAY)
            return retryRequest<T>(config, retries - 1)
        }
        throw error
    }
}

/** delay */
function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}



/** should retry */
function shouldRetry(statusCode: number) {
    return [
        ApiStatus.requestTimeout,
        ApiStatus.internalServerError,
        ApiStatus.badGateway,
        ApiStatus.serviceUnavailable,
        ApiStatus.gatewayTimeout
    ].includes(statusCode)
}


/** 401 */
function resetUnauthorizedError() {
    isUnauthorizedErrorShown = false
    if (unauthorizedTimer) clearTimeout(unauthorizedTimer)
    unauthorizedTimer = null
}


/** Request function */
async function request<T = any>(config: ExtendedAxiosRequestConfig): Promise<T> {
    // Automatically move POST | PUT params into the request body
    if (
        ['POST', 'PUT'].includes(config.method?.toUpperCase() || '') &&
        config.params &&
        !config.data
    ) {
        config.data = config.params
        config.params = undefined
    }

    try {
        const res = await axiosInstance.request<Http.BaseResponse<T>>(config)

        console.log("res", res);
        // Show success message
        if (config.showSuccessMessage && res.data.msg) {
            showSuccess(res.data.msg)
        }

        return res.data.data as T
    } catch (error) {
        if (error instanceof HttpError && error.code !== ApiStatus.unauthorized) {
            const showMsg = config.showErrorMessage !== false
            showError(error, showMsg)
        }
        return Promise.reject(error)
    }
}


/** API */
const api = {
    get<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...config, method: 'GET' })
    },
    post<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...config, method: 'POST' })
    },
    put<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...config, method: 'PUT' })
    },
    del<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>({ ...config, method: 'DELETE' })
    },
    request<T>(config: ExtendedAxiosRequestConfig) {
        return retryRequest<T>(config)
    }
}

export default api