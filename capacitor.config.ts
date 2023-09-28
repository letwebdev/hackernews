import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'github.letwebdev.hackernews',
  appName: 'Hacker News',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
