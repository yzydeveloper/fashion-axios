import { defineConfig } from 'vite'
import VuePlugin from '@vitejs/plugin-vue'
import BabelPlugin from 'vite-plugin-babel-compiler'

const PORT = 6969

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: PORT,
        hmr: true,
        open: true,
        proxy: {
            '/api': {
                target: `http://127.0.0.1:${PORT}`,
                changeOrigin: true
            }
        }
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
                httpServer?.on('request', (req, res) => {
                    if (req.url === '/api/custom/list' && req.method === 'GET') {
                        res.end(JSON.stringify([{
                            id: '1',
                            name: 'test1'
                        }, {
                            id: '2',
                            test: 'test2'
                        }]))
                    }

                    if (req.url === '/api/custom/create' && req.method === 'POST') {
                        let bf = ''
                        req.on('data', (chunk) => {
                            bf += chunk
                        })
                        req.on('end', () => {
                            res.setHeader('Content-Type', 'application/json;charset=UTF-8')
                            res.end(bf)
                        })
                    }

                    if (req.url === '/api/custom/delete') {
                        res.end()
                    }
                })
            }
        }
    ]
})
