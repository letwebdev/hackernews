import { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "github.letwebdev.hackernews",
  appName: "Hacker News",
  webDir: "dist",
  android: {
    path: "release/android",
  },
  server: {
    androidScheme: "https",
  },
}

export default config
