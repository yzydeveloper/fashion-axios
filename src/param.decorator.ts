import { ARGS_METADATA } from './constants'

export enum Paramtypes {
    BODY = 'BODY',
    QUERY = 'QUERY',
    HEADER = 'HEADER'
}

export function assignMetadata<TParamtype = any, TArgs = any>(
    args: TArgs,
    paramtype: TParamtype,
    index: number,
) {
    return {
        ...args,
        [`${paramtype}:${index}`]: {
            index,
        },
    }
}

function createParamDecorator(
    paramType: Paramtypes
): ParameterDecorator {
    return (target, key, index) => {
        const args = Reflect.getMetadata(ARGS_METADATA, target.constructor, key) || {}
        Reflect.defineMetadata(
            ARGS_METADATA,
            assignMetadata(
                args,
                paramType,
                index
            ),
            target.constructor,
            key
        )
    }
}

export const Body = () => createParamDecorator(Paramtypes.BODY)

export const Query = () => createParamDecorator(Paramtypes.QUERY)

export const Header = () => createParamDecorator(Paramtypes.HEADER)
