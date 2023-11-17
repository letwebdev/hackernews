# Hacker News

## Screenshots

See [Screenshots in Wiki](https://github.com/letwebdev/hackernews/wiki/Screenshots)

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

For more details, see [Add Capacitor to your web app](https://capacitorjs.com/docs/getting-started#add-capacitor-to-your-web-app).

- Capacitor

  ```sh
  npm install
  ```

- Either of

  - Android Studio
  - Both of

    - Java(8<= version <= 19, tested on Java 19)
    - Basic Android command-line tools

      1. Set [ANDROID_HOME](https://developer.android.com/tools/variables#android_home)
      2. Download the command line tools zip from [Download Android Studio & App Tools - Android Developers](https://developer.android.com/studio) > Command line tools only
      3. Unzip it to `"${ANDROID_HOME}/cmdline-tools/latest"`
      4. Add these tools to PATH

         ```sh
         export PATH="${ANDROID_HOME}/cmdline-tools/latest/bin:${PATH}" >> "${HOME}/.profile"
         source "${HOME}/.profile"
         ```

      5. Accept the licenses

         ```sh
         yes | sdkmanager --licenses
         ```

### Create an Android project

Modify capacitor.config.ts first(optional)

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

Set [GRADLE_USER_HOME](https://docs.gradle.org/current/userguide/directory_layout.html#dir:gradle_user_home)(optional, defaults to `"${HOME}/.gradle"`)

##### Build and Sync the web code to, then Build the native project

```sh
# The built apk is located at "android/app/build/outputs/apk/debug/app-debug.apk"
npm run build-apk
```

## TODO

CSS: mobile first
