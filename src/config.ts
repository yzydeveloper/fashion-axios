import Axios, { AxiosRequestConfig, AxiosInstance } from 'axios'
import { DEFAULT_CLIENT_NAME } from './constants'

export const clientMap: Map<string, AxiosInstance> = new Map()

export interface Options extends AxiosRequestConfig {
    name?: string
}

export function defineConfig(config: Options | Options[]) {
    if (!Array.isArray(config)) {
        clientMap.set(config.name || DEFAULT_CLIENT_NAME, Axios.create(config))
    }

    if (Array.isArray(config)) {
        config.forEach(cfg => {
            clientMap.set(cfg.name || DEFAULT_CLIENT_NAME, Axios.create(cfg))
        })
    }
}
