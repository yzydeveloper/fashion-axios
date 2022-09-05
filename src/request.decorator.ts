import { PATH_METADATA, METHOD_METADATA, CLIENT_NAME_METADATA, ARGS_METADATA } from './constants'
import { AxiosRequestConfig } from 'axios'
import { clientMap } from './config'

export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

export interface RequestMappingMetadata {
    path?: string
    method?: RequestMethod
}

type IAxiosRequestConfig = Pick<AxiosRequestConfig, 'url' | 'method' | 'headers' | 'data' | 'params'>

export function defineRequestMetadata(
    metadata: RequestMappingMetadata
) {
    const path = metadata.path || '/'
    const method = metadata.method || RequestMethod.GET
    return (
        target: object,
        key: string,
        descriptor: TypedPropertyDescriptor<any>
    ) => {
        descriptor.value = (...args: unknown[]) => {
            const clientNameMetadata = Reflect.getMetadata(CLIENT_NAME_METADATA, target.constructor)
            const argsMetadata = Reflect.getMetadata(ARGS_METADATA, target.constructor, key)
            const axiosClient = clientMap.get(clientNameMetadata)
            const axiosConfig = Object.entries(argsMetadata).reduce<IAxiosRequestConfig>((cfg, item) => {
                const [set] = item
                const [paramType, index] = set.split(':')
                console.log('[paramType]', paramType)
                console.log('[index]', index)
                return cfg
            }, {
                url: path,
                method,
            })
            axiosClient?.(axiosConfig)
        }
        Reflect.defineMetadata(PATH_METADATA, path, descriptor.value)
        Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value)
        return descriptor
    }
}

function createRequestDecorator(method: RequestMethod) {
    return (path: string) => defineRequestMetadata({
        path,
        method
    })
}

export const Get = createRequestDecorator(RequestMethod.GET)

export const Post = createRequestDecorator(RequestMethod.POST)

export const Put = createRequestDecorator(RequestMethod.PUT)

export const Delete = createRequestDecorator(RequestMethod.DELETE)
