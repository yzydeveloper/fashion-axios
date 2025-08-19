import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import Axios from 'axios'
import { DEFAULT_CLIENT_NAME } from './constants'

export const clientMap: Map<string, AxiosInstance> = new Map()

export interface Options extends AxiosRequestConfig {
    name?: string
    interceptorConfig?: {
        request?: {
            onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
            onRejected?: (error: Error) => void;
        }
        response?: {
            onFulfilled?: (res: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
            onRejected?: (error: Error) => void;
        },
    }
}

function createClient(config: Options) {
    const client = Axios.create(config)
    const requestInterceptor = config.interceptorConfig?.request
    const responseInterceptor = config.interceptorConfig?.response

    if (requestInterceptor) {
        client.interceptors.request.use(
            requestInterceptor.onFulfilled,
            requestInterceptor.onRejected
        )
    }
    if (responseInterceptor) {
        client.interceptors.response.use(
            responseInterceptor.onFulfilled,
            responseInterceptor.onRejected
        )
    }
    return client
}

export function useClient(name?: string) {
    const clientName = name ?? DEFAULT_CLIENT_NAME

    if (!clientMap.has(clientName)) {
        return createClient({})
    }

    return clientMap.get(clientName)!
}

export function defineConfig(config: Options | Options[]) {
    if (!Array.isArray(config)) {
        clientMap.set(config.name || DEFAULT_CLIENT_NAME, createClient(config))
    }

    if (Array.isArray(config)) {
        config.forEach(cfg => {
            clientMap.set(cfg.name || DEFAULT_CLIENT_NAME, createClient(cfg))
        })
    }
}
