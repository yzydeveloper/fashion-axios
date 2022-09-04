import 'reflect-metadata'
import { ARGS_METADATA, Body } from '../src'
import { describe, expect, test } from 'vitest'

describe('param decorator', () => {
    test('body', () => {
        class DecoratorOfBody {
            getName(
                @Body() params: any
            ) { }
        }

        const metadata = Reflect.getMetadata(ARGS_METADATA, DecoratorOfBody, 'getName')
        const key = Object.keys(metadata)[0]

        expect(metadata[key]).toStrictEqual({
            index: 0
        })
    })
})
