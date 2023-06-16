import baseConfig from './vite.config.base';
import { resolve } from 'path';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');

baseConfig.publicDir = 'dist/';

baseConfig.build.rollupOptions.input = {
  content: resolve(pagesDir, 'content', 'index.ts')
};

// baseConfig.build.rollupOptions.output.format = 'iife';

export default baseConfig;
