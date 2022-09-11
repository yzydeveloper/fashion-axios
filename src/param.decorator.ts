import { ARGS_METADATA } from './constants'

export enum Paramtypes {
    BODY = 'BODY',
    QUERY = 'QUERY',
    PATH = 'PATH',
    HEADER = 'HEADER',
    FORM_DATA = 'FORM_DATA'
}

export function assignMetadata<TParamtype extends keyof typeof Paramtypes, TArgs = any>(
    args: TArgs,
    paramtype: TParamtype,
    index: number,
    property?: string,
) {
    return {
        ...args,
        [`${paramtype}:${index}`]: {
            property,
            index,
        },
    }
}

function createParamDecorator(
    paramType: Paramtypes
) {
    return (property?: string): ParameterDecorator => (target, key, index) => {
        const args = Reflect.getMetadata(ARGS_METADATA, target.constructor, key) || {}
        Reflect.defineMetadata(
            ARGS_METADATA,
            assignMetadata(
                args,
                paramType,
                index,
                property,
            ),
            target.constructor,
            key
        )
    }
}

export const Body = (property?: string) => createParamDecorator(Paramtypes.BODY)(property)

export const Query = (property?: string) => createParamDecorator(Paramtypes.QUERY)(property)

export const Path = (property?: string) => createParamDecorator(Paramtypes.PATH)(property)

export const Header = (property?: string) => createParamDecorator(Paramtypes.HEADER)(property)

export const FormData = (property?: string) => createParamDecorator(Paramtypes.FORM_DATA)(property)
