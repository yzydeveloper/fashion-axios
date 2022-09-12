import { createApp } from 'vue'
import App from './App.vue'
import { defineConfig } from 'fashion-axios'

import './style.css'

defineConfig({
    baseURL: '/api',
    interceptorConfig: {
        request: {
            onFulfilled(config) {
                if(config.method === 'get') {
                    config.url += `${(config.url?.indexOf('?') ?? -1) < 0 ? '?' : '&'}t=${Date.now()}`
                }
                return config
            },
        },
        response: {
            onFulfilled({ data }) {
                return data
            },
        }
    }
})

createApp(App).mount('#app')
