/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import { resolve } from "path";

const root = resolve(__dirname, "src", "app");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@lib": resolve(__dirname, "./src/lib"),
      "@styles": resolve(__dirname, "./src/lib/styles"),
    },
  },
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        "basic-scene": resolve(root, "basic-scene", "index.html"),
        "transform-objects": resolve(root, "transform-objects", "index.html"),
      },
    },
  },
});
