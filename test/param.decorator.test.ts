import 'reflect-metadata'
import { describe, expect, test } from 'vitest'
import { defineConfig, Body, Get, Query, ARGS_METADATA, Client } from '../src'

defineConfig({
    name: 'default',
    baseURL: '',
})

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

    test('validate param', () => {
        @Client()
        class DecoratorOfReqAndParam {
            @Get('/')
            getName(
                @Query() params: { id: string, name: string }
            ) { }
        }

        const api = new DecoratorOfReqAndParam()
        api.getName({
            id: 'id',
            name: 'name'
        })
    })
})
