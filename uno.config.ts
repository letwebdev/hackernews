import { defineConfig, presetUno, presetIcons } from "unocss"
import transformerVariantGroup from "@unocss/transformer-variant-group"

export default defineConfig({
  presets: [presetUno(), presetIcons()],
  transformers: [transformerVariantGroup()],
  theme: {
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      huge: "2560px",
    },
  },
})
