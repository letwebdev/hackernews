# Hacker News 

## known bugs

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Build APK

### Recuirements

- Android Studio
- Capacitor

For more details, see [Add Capacitor to your web app](https://capacitorjs.com/docs/getting-started#add-capacitor-to-your-web-app)

```sh

# Install Capacitor
npm i @capacitor/core
npm i -D @capacitor/cli

# Initialize Capacitor config
npx cap init

# Create a Android project
npm i @capacitor/android
npx cap add android

# Sync the web code to the native project
npm run build
npx cap sync

# Open the project in Android Studio
npx cap open android

# In Android Studio, edit app/assets/public/index.html:
# replace all "/hackernews" with "."

# In Android Studio, Build -> Build bundle(s) / APK(s) -> Build APK(s)

```
