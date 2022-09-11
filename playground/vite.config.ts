import { defineConfig } from 'vite'
import VuePlugin from '@vitejs/plugin-vue'
import BabelPlugin from 'vite-plugin-babel-compiler'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        hmr: true,
        open: true
    },
    plugins: [
        VuePlugin(),
        // If it is `js` to use the decorator, it needs to be configured
        BabelPlugin({
            babel: {
                plugins: [
                    ['@babel/plugin-proposal-decorators', { legacy: true }],
                    ['@babel/plugin-proposal-class-properties', { loose: true }],
                ]
            }
        }),
        {
            name: 'vite-plugin-server',
            configureServer({ httpServer }) {
                httpServer?.on('request', (req) => {
                    console.log(req.url, '>>>', req.method)
                })
            }
        }
    ]
})
