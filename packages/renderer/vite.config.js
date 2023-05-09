/* eslint-env node */

import {chrome} from '../../.electron-vendors.cache.json';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import {renderer} from 'unplugin-auto-expose';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';
import {join} from 'node:path';
import {injectAppVersion} from '../../version/inject-app-version-plugin.mjs';

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, '../..');

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: {
        index: join(PACKAGE_ROOT, 'index.html'),
        'pdf.worker': join(PROJECT_ROOT, 'node_modules/pdfjs-dist/build/pdf.worker.entry'),
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  test: {
    environment: 'happy-dom',
  },
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
    }),
    injectAppVersion(),
  ],
};

export default config;
