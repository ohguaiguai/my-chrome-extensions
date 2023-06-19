import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import makeManifest from "./utils/plugins/make-manifest";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

export default defineConfig({
  css: {},
  plugins: [
    makeManifest(),
    // visualizer({
    //   gzipSize: true,
    //   brotliSize: true,
    //   emitFile: false,
    //   filename: 'test.html', //分析图生成的文件名
    //   open: true //如果存在本地服务端口，将在打包后自动展示
    // })
  ],
  publicDir,
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir,
    },
  },
  build: {
    emptyOutDir: false,
    outDir,
    sourcemap: process.env.__DEV__ === "true",
    rollupOptions: {
      input: {
        background: resolve(pagesDir, "background", "index.ts"),
        popup: resolve(pagesDir, "popup", "index.html"),
        content: resolve(pagesDir, "content", "index.ts"),
      },
      output: {
        entryFileNames: (chunk: { name: string }) =>
          `src/pages/${chunk.name}/index.js`,
      },
      manualChunks: {
        antd: ["antd"],
        react: ["react"],
      },
    },
  },
});
