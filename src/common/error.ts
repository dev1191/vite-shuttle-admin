import { AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import { ApiStatus } from './status'
import { $t } from '@/plugins/i18n'

// Error response interface
export interface ErrorResponse {
    code: number
    msg: string
    data?: unknown
}

// Error log data interface
export interface ErrorLogData {
    code: number
    message: string
    data?: unknown
    timestamp: string
    url?: string
    method?: string
    stack?: string
}

// Custom HttpError class
export class HttpError extends Error {
    public readonly code: number
    public readonly data?: unknown
    public readonly timestamp: string
    public readonly url?: string
    public readonly method?: string

    constructor(
        message: string,
        code: number,
        options?: {
            data?: unknown
            url?: string
            method?: string
        }
    ) {
        super(message)
        this.name = 'HttpError'
        this.code = code
        this.data = options?.data
        this.timestamp = new Date().toISOString()
        this.url = options?.url
        this.method = options?.method
    }

    public toLogData(): ErrorLogData {
        return {
            code: this.code,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp,
            url: this.url,
            method: this.method,
            stack: this.stack
        }
    }
}

/**
 * Get the error message by status code
 * @param status Error status code
 * @returns Localized error message
 */
const getErrorMessage = (status: number): string => {
    const errorMap: Record<number, string> = {
        [ApiStatus.unauthorized]: 'httpMsg.unauthorized',
        [ApiStatus.forbidden]: 'httpMsg.forbidden',
        [ApiStatus.notFound]: 'httpMsg.notFound',
        [ApiStatus.methodNotAllowed]: 'httpMsg.methodNotAllowed',
        [ApiStatus.requestTimeout]: 'httpMsg.requestTimeout',
        [ApiStatus.internalServerError]: 'httpMsg.internalServerError',
        [ApiStatus.badGateway]: 'httpMsg.badGateway',
        [ApiStatus.serviceUnavailable]: 'httpMsg.serviceUnavailable',
        [ApiStatus.gatewayTimeout]: 'httpMsg.gatewayTimeout'
    }

    return $t(errorMap[status] || 'httpMsg.internalServerError')
}

/**
 * Handle HTTP errors
 * @param error Axios error object
 * @returns Throws HttpError
 */
export function handleError(error: AxiosError<ErrorResponse>): never {
    // Handle canceled requests
    if (error.code === 'ERR_CANCELED') {
        console.warn('Request cancelled:', error.message)
        throw new HttpError($t('httpMsg.requestCancelled'), ApiStatus.error)
    }

    const statusCode = error.response?.status
    const errorMessage = error.response?.data?.msg || error.message
    const requestConfig = error.config

    // Handle network errors
    if (!error.response) {
        throw new HttpError($t('httpMsg.networkError'), ApiStatus.error, {
            url: requestConfig?.url,
            method: requestConfig?.method?.toUpperCase()
        })
    }

    // Handle HTTP status code errors
    const message = statusCode
        ? getErrorMessage(statusCode)
        : errorMessage || $t('httpMsg.requestFailed')
    throw new HttpError(message, statusCode || ApiStatus.error, {
        data: error.response.data,
        url: requestConfig?.url,
        method: requestConfig?.method?.toUpperCase()
    })
}

/**
 * Show error message
 * @param error HttpError object
 * @param showMessage Whether to display the error message (default: true)
 */
export function showError(error: HttpError, showMessage: boolean = true): void {
    if (showMessage) {
        message.error(error.message)
    }
    // Log the error
    console.error('[HTTP Error]', error.toLogData())
}

/**
 * Show success message
 * @param msg Success message text
 * @param showMessage Whether to display the message (default: true)
 */
export function showSuccess(msg: string, showMessage: boolean = true): void {
    if (showMessage) {
        message.success(msg)
    }
}

/**
 * Check if an error is an HttpError
 * @param error Unknown error object
 * @returns True if the error is an instance of HttpError
 */
export const isHttpError = (error: unknown): error is HttpError => {
    return error instanceof HttpError
}
