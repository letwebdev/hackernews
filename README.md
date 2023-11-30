# Hacker News

## Screenshots

See [Screenshots in Wiki](https://github.com/letwebdev/hackernews/wiki/Screenshots)

## Project Setup

```sh
npm install
```

Compile and Hot-Reload for Development

```sh
npm run dev
```

- If [Electron installed](#install-extra-recuirements)

  ```sh
  npm run dev:electron
  ```

Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Build APK

### Extra recuirements

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

For more details, see [Add Capacitor to your web app](https://capacitorjs.com/docs/getting-started#add-capacitor-to-your-web-app).

Modify capacitor.config.ts first(optional), and then

```sh
npx cap add android
```

### Build

#### At the command line

1. Set [GRADLE_USER_HOME](https://docs.gradle.org/current/userguide/directory_layout.html#dir:gradle_user_home)(optional, defaults to `"${HOME}/.gradle"`)
2. Build and Sync the web code to, then Build the native project

   ```sh
   # The built apk is located at "release/android/app/build/outputs/apk/debug/app-debug.apk"
   npm run build:apk
   ```

#### With Android Studio

1. Build and Sync the web code to the native project

   ```sh
   npm run sync
   ```

2. Open Android Studio

   ```sh
   npx cap open android
   ```

3. Build > Build bundle(s) / APK(s) > Build APK(s)

## Build Electron app

### Install extra recuirements

```sh
npm run setUp:electron

# Not save the related packages to package.json
#npm run setUp:noSave:electron
```

### Build app

```sh
# Build web code and then build Electron app
npm run build:electron
```

---

For more scripts, see

```sh
npm run
```
