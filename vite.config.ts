import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import topLevelAwait from "vite-plugin-top-level-await";
import { fileURLToPath, URL } from "node:url";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
    plugins: [
        vue(),
        topLevelAwait({
            promiseExportName: "__tla",
            promiseImportName: (i) => `__tla_${i}`,
        }),
        viteCompression(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 8000,
        host: "0.0.0.0",
    },
    preview: {
        port: 8001,
        host: "0.0.0.0",
    },
});
