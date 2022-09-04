import { clientMap } from './config'
import { CLIENT_METADATA, CLIENT_NAME_METADATA, DEFAULT_CLIENT_NAME, BASE_URL_METADATA } from './constants'

export interface ClientParams {
    name?: string
}

export function Client(params?: ClientParams) {
    return (target: object) => {
        const clientName = params?.name || DEFAULT_CLIENT_NAME
        Reflect.defineMetadata(CLIENT_NAME_METADATA, clientName, target)
        Reflect.defineMetadata(CLIENT_METADATA, clientMap.get(clientName), target)
    }
}

export function Api(baseUrl?: string) {
    return (target: object) => {
        Reflect.defineMetadata(BASE_URL_METADATA, baseUrl || '/', target)
    }
}
