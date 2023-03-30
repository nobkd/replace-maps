import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    publicDir: '../public',
    build: {
        outDir: '../.dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                bg: resolve(__dirname, 'src/bg.html'),
                map: resolve(__dirname, 'src/map.html'),
            },
        },
    },
    esbuild: {
        supported: {
            'top-level-await': true,
        },
    },
});
