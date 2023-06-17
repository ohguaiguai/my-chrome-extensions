import baseConfig from "./vite.config.base";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import makeManifest from "./utils/plugins/make-manifest";
import { visualizer } from "rollup-plugin-visualizer";
import vitePluginImp from "vite-plugin-imp";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");

baseConfig.css = {
  preprocessorOptions: {
    less: {
      javascriptEnabled: true,
      modifyVars: {
        "@primary-color": "#4377FE", //设置antd主题色
      },
    },
  },
};

(baseConfig.plugins as any) = [
  ...baseConfig.plugins,
  react(),
  makeManifest(),
  vitePluginImp({
    libList: [
      {
        libName: "antd",
        style: (name) => `antd/es/${name}/style`,
      },
    ],
  }),
  visualizer({
    gzipSize: true,
    brotliSize: true,
    emitFile: false,
    filename: "test.html", //分析图生成的文件名
    open: true, //如果存在本地服务端口，将在打包后自动展示
  }),
];

baseConfig.build.rollupOptions.input = {
  // devtools: resolve(pagesDir, 'devtools', 'index.html'),
  // panel: resolve(pagesDir, 'panel', 'index.html'),
  background: resolve(pagesDir, "background", "index.ts"),
  popup: resolve(pagesDir, "popup", "index.html"),
  // newtab: resolve(pagesDir, 'newtab', 'index.html'),
  // options: resolve(pagesDir, 'options', 'index.html')
};

export default baseConfig;
