import 'reflect-metadata'
import { describe, expect, test } from 'vitest'
import { Client, Api, CLIENT_NAME_METADATA, BASE_URL_METADATA } from '../src'

describe('test class decorator', () => {
    test('default client name', () => {
        @Client()
        class DecoratorOfClient { }
        const name = Reflect.getMetadata(CLIENT_NAME_METADATA, DecoratorOfClient)

        expect(name).toStrictEqual('default')
    })

    test('custom client name', () => {
        @Client({
            name: 'custom-client'
        })
        class DecoratorOfClient { }
        const name = Reflect.getMetadata(CLIENT_NAME_METADATA, DecoratorOfClient)

        expect(name).toStrictEqual('custom-client')
    })

    test('test base-url', () => {
        @Api('/test')
        class BaseUrl { }
        const baseUrl = Reflect.getMetadata(BASE_URL_METADATA, BaseUrl)

        expect(baseUrl).toStrictEqual('/test')
    })
})
