import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
    plugins: [
        vue(),
        topLevelAwait({
            promiseExportName: '__tla',
            promiseImportName: i => `__tla_${i}`
        }),
    ],
    server: {
        port: 8000,
        host: '0.0.0.0'
    }
})
