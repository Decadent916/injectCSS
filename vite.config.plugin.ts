import { defineConfig } from "vite";
import { resolve } from "path";
// import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vite.dev/config/
export default defineConfig({
  // plugins: [cssInjectedByJsPlugin()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/plugin.tsx"),
      name: "InjectCSS",
      formats: ["iife"],
      fileName: () => "plugin.js",
      cssFileName: "plugin",
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "{}",
    process: "{}",
  },
});
