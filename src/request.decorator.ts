import type { AxiosRequestConfig } from 'axios'
import { PATH_METADATA, METHOD_METADATA, CLIENT_NAME_METADATA, ARGS_METADATA, DEFAULT_CLIENT_NAME, BASE_URL_METADATA } from './constants'
import Axios from 'axios'
import { clientMap } from './config'
import { Paramtypes } from './param.decorator'

export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

export enum ContentTypeEnum {
    JSON = 'application/json;charset=UTF-8',
    FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
    FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

export interface RequestMappingMetadata {
    path?: string
    method?: RequestMethod
}

type IAxiosRequestConfig = Pick<AxiosRequestConfig, 'url' | 'method' | 'headers' | 'data' | 'params'>

function isObject(value: unknown): value is Record<string, any> {
    return Object.prototype.toString.call(value) === '[object Object]'
}

const _defaultClient = Axios.create({})

export function defineRequestMetadata(
    metadata: RequestMappingMetadata
) {
    let path = metadata.path || '/'
    const method = metadata.method || RequestMethod.GET
    return (
        target: object,
        key: string,
        descriptor: TypedPropertyDescriptor<any>
    ) => {
        descriptor.value = (...args: any[]) => {
            const clientNameMetadata = Reflect.getMetadata(CLIENT_NAME_METADATA, target.constructor) ?? DEFAULT_CLIENT_NAME
            const argsMetadata = Reflect.getMetadata(ARGS_METADATA, target.constructor, key) ?? {}
            const axiosClient = clientMap.get(clientNameMetadata) ?? _defaultClient
            const baseUrl = Reflect.getMetadata(BASE_URL_METADATA, target.constructor)
            path = `${baseUrl}${path}`

            const axiosConfig = Object.entries<{
                property: string | undefined,
                index: number
            }>(argsMetadata).reduce<IAxiosRequestConfig>((cfg, item) => {
                const [metakey, metavalue] = item
                const [paramType, index] = metakey.split(':')
                const { property } = metavalue
                const argValue = args[parseInt(index, 10)]

                if (paramType === Paramtypes.BODY) {
                    if (property) {
                        cfg.data = Object.assign(cfg.data ?? {}, { [property]: argValue })
                    } else {
                        cfg.data = Object.assign(cfg.data ?? {}, argValue)
                    }
                }
                if (paramType === Paramtypes.QUERY) {
                    if (!isObject(argValue) && !property) {
                        throw new Error('query is missing unique key')
                    }

                    if (property) {
                        cfg.params = Object.assign(cfg.params ?? {}, { [property]: argValue })
                    } else {
                        cfg.params = Object.assign(cfg.params ?? {}, argValue)
                    }
                }
                if (paramType === Paramtypes.HEADER) {
                    if (!isObject(argValue) && !property) {
                        throw new Error('header is missing unique key')
                    }

                    if (property) {
                        cfg.headers = Object.assign(cfg.headers ?? {}, { [property]: argValue })
                    } else {
                        cfg.headers = Object.assign(cfg.headers ?? {}, argValue)
                    }
                }
                if (paramType === Paramtypes.PATH) {
                    if (!property) {
                        throw new Error('path is missing unique key')
                    }
                    const url = path.replace(`:${property}`, argValue)
                    cfg.url = url
                }
                if (paramType === Paramtypes.FORM_DATA) {
                    let formData = new FormData()
                    if (argValue instanceof FormData) {
                        formData = argValue
                    } else {
                        Object.keys(argValue).forEach(key => {
                            const value = argValue[key]
                            if (Array.isArray(value)) {
                                value.forEach((item) => {
                                    formData.append(`${key}[]`, item)
                                })
                                return
                            }

                            formData.append(key, argValue[key])
                        })
                    }
                    cfg.data = formData
                }
                return cfg
            }, {
                url: path,
                method,
                headers: {
                    'Content-type': ContentTypeEnum.JSON
                }
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
