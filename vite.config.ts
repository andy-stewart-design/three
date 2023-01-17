/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import { resolve } from "path";
import glob from "glob";

const root = resolve(__dirname, "src", "app");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@lib": resolve(__dirname, "src/lib"),
      "@styles": resolve(__dirname, "src/lib/styles"),
    },
  },
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: glob.sync(resolve(root, "**/index.html")),
    },
  },
});
