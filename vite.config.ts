import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import glsl from 'rollup-plugin-glsl';
// import element3Webgl from 'rollup-plugin-element3-webgl';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        glsl({
            include: '**/*.glsl',
            exclude: ['**/index.html'],
        }),
    ],
});
