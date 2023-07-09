/// <reference types="vitest" />

import { defineConfig, normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    publicDir: '../public',
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(resolve(__dirname, 'node_modules/leaflet/dist/leaflet.css')),
                    dest: '.',
                },
                {
                    src: normalizePath(resolve(__dirname, 'node_modules/leaflet/dist/images')),
                    dest: '.',
                },
                {
                    src: normalizePath(resolve(__dirname, 'LICENSE')),
                    dest: '.',
                },
            ],
        }),
    ],
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                bg: normalizePath(resolve(__dirname, 'src/bg.html')),
                map: normalizePath(resolve(__dirname, 'src/map.html')),
                opt: normalizePath(resolve(__dirname, 'src/options.html')),
            },
        },
    },
    esbuild: {
        supported: {
            'top-level-await': true,
        },
        drop: ['debugger'],
        pure: ['console.log', 'console.warn', 'console.error', 'console.debug', 'console.trace'],
    },
    test: {
        root: '.',
    },
});
