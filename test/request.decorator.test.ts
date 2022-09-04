import 'reflect-metadata'
import { describe, expect, test } from 'vitest'
import { Get, PATH_METADATA } from '../src'

describe('request decorator', () => {
    test('get', () => {
        class DecoratorOfGet {
            @Get('/get-name')
            getName() { }
        }
        const api = new DecoratorOfGet()
        const path = Reflect.getMetadata(PATH_METADATA, api.getName)

        expect(path).toStrictEqual('/get-name')
    })
})
