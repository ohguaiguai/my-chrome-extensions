import baseConfig from "./vite.config.base";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import makeManifest from "./utils/plugins/make-manifest";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");

(baseConfig.plugins as any) = [...baseConfig.plugins, react(), makeManifest()];

baseConfig.build.rollupOptions.input = {
  // devtools: resolve(pagesDir, 'devtools', 'index.html'),
  // panel: resolve(pagesDir, 'panel', 'index.html'),
  background: resolve(pagesDir, "background", "index.ts"),
  popup: resolve(pagesDir, "popup", "index.html"),
  // newtab: resolve(pagesDir, 'newtab', 'index.html'),
  // options: resolve(pagesDir, 'options', 'index.html'),
};

export default baseConfig;
