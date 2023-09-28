# Hacker News 

## known bugs

## Customize vite configuration

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


- Capacitor
- either of
  - Android Studio
    - For more details, see [Add Capacitor to your web app](https://capacitorjs.com/docs/getting-started#add-capacitor-to-your-web-app).
  - basic Android command-line tools

#### Install basic Android command line tools

1. Download the command line tools zip from [Download Android Studio & App Tools - Android Developers](https://developer.android.com/studio) > Command line tools only

2. Unzip it to `"${ANDROID_HOME}/cmdline-tools/latest"`

3. Add these tools to PATH

```sh
export PATH="${ANDROID_HOME}/cmdline-tools/latest/bin:${PATH}" >> "${HOME}/.profile"
source "${HOME}/.profile"
```

4. Accept the licenses

```sh
yes | sdkmanager --licenses
```

### Install Capacitor

```sh
npm install
```

### Create an Android project

```sh
npx cap add android
```

### Build

#### With Android Studio

##### Build and Sync the web code to the native project

```sh
npm run sync
```

##### Open Android Studio

```sh
npx cap open android
```

Build > Build bundle(s) / APK(s) > Build APK(s)  

#### With command line tools

##### Set environment variables

- [ANDROID_HOME](https://developer.android.com/tools/variables#android_home)
- [GRADLE_USER_HOME](https://docs.gradle.org/current/userguide/directory_layout.html#dir:gradle_user_home)(optional, defaults to `"${HOME}/.gradle"`)

##### Build and Sync the web code to, then Build the native project

```sh
# The built apk is located at "android/app/build/outputs/apk/debug/app-debug.apk"
npm run build-apk
```
