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
            },
        },
    },
    esbuild: {
        supported: {
            'top-level-await': true,
        },
    },
    test: {
        root: '.',
    },
});
