import { PATH_METADATA, METHOD_METADATA } from './constants'

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
            // Reflect.getMetadata(CLIENT_NAME_METADATA,target.constructor)
            // Reflect.getMetadata(ARGS_METADATA, target.constructor, key)
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
