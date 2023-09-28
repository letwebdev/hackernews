# Hacker News 

## known bugs

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install --omit=optional
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
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

### Install extra dependencies

```sh
npm install
```

### Create a Android project

```sh
npx cap add android
```

### Build and sync the web code to the native project

```sh
npm run sync
```

### Open the project in Android Studio

```sh
npx cap open android
```

In "app/assets/public/index.html", replace all "/hackernews" with "."  
Build -> Build bundle(s) / APK(s) -> Build APK(s)  
