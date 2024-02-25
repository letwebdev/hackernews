import { defineConfig, presetUno, presetIcons } from "unocss"
import transformerVariantGroup from "@unocss/transformer-variant-group"

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  transformers: [transformerVariantGroup()],
  theme: {
    breakpoints: {
      huge: "2560px",
    },
  },
})
