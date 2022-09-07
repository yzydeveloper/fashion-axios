import type { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { PATH_METADATA, METHOD_METADATA, CLIENT_NAME_METADATA, ARGS_METADATA } from './constants'
import Axios from 'axios'
import { clientMap } from './config'
import { Paramtypes } from './param.decorator'

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

const _defaultClient = Axios.create({})

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
            const axiosClient = clientMap.get(clientNameMetadata) ?? _defaultClient

            const axiosConfig = Object.entries(argsMetadata).reduce<IAxiosRequestConfig>((cfg, item) => {
                const [set] = item
                const [paramType, index] = set.split(':')
                const value = args[parseInt(index, 10)]

                if (paramType === Paramtypes.BODY) {
                    cfg.data = value
                }
                if (paramType === Paramtypes.QUERY) {
                    cfg.params = value
                }
                if (paramType === Paramtypes.HEADER) {
                    cfg.headers = value as AxiosRequestHeaders
                }
                return cfg
            }, {
                url: path,
                method,
            })
            return axiosClient?.(axiosConfig)
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
