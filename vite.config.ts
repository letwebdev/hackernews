import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

import AutoImport from "unplugin-auto-import/vite"
import UnoCSS from "unocss/vite"

import electron from "vite-plugin-electron"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      /* options */
    }),
    UnoCSS(),
    electron({
      onstart(args) {
        if (process.env.VITE_LAUNCHING_ELECTRON) {
          args.startup([".", "--no-sandbox"])
        }
      },
      entry: "electron/main.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: process.env.VITE_BASE || undefined,
})
