import { resolve } from "path";
import svgr from "vite-plugin-svgr";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

export default {
  css: {},
  plugins: [
    svgr({
      svgrOptions: {
        ref: true,
      },
    }),
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
      input: {},
      output: {
        entryFileNames: (chunk: { name: string }) =>
          `src/pages/${chunk.name}/index.js`,
      },
    },
  },
};
