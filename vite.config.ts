import { fileURLToPath, URL } from "node:url"

import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import vueJsx from "@vitejs/plugin-vue-jsx"

import AutoImport from "unplugin-auto-import/vite"

import UnoCSS from "unocss/vite"
import vuetify from "vite-plugin-vuetify"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),

    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "@vueuse/core",
        "pinia",
        "vitest",
        {
          "@vue/test-utils": ["mount"],
        },
        {
          "echarts/core": ["use", "graphic"],
          "echarts/renderers": ["CanvasRenderer"],
          "echarts/charts": ["BarChart", "PieChart", "LineChart", "RadarChart", "GaugeChart"],
          "echarts/components": [
            "DatasetComponent",
            "DataZoomComponent",
            "GridComponent",
            "LegendComponent",
            "MarkLineComponent",
            "TitleComponent",
            "ToolboxComponent",
            "TooltipComponent",
          ],
        },
      ],
      // Auto import for module exports under directories
      // by default it only scan one level of modules under the directory
      dirs: [
        // './composables' // only root modules
        // './composables/**', // all nested modules
      ],
      // Auto import inside Vue template
      vueTemplate: true,
      // Custom resolvers, compatible with `unplugin-vue-components`
      resolvers: [],
      eslintrc: { enabled: true },
    }),

    UnoCSS(),
    vuetify(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: process.env.VITE_BASE || undefined,
})
