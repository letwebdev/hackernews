import { CapacitorConfig } from "@capacitor/cli"
import "dotenv/config"

const config: CapacitorConfig = {
  appId: "github.letwebdev.hackernews",
  appName: "Hacker News",
  webDir: "dist",
  android: {
    path: process.env.CAPACITOR_ANDROID_PATH,
  },
  server: {
    androidScheme: "https",
  },
}

export default config
