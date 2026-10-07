# Mobile Builds

Expo EAS build profiles for user-app and assistant-app.

## Android APK

    export EXPO_TOKEN=...
    bash scripts/build-apk.sh user-app

## iOS IPA

    bash scripts/build-ios.sh user-app

## Profiles

development   Internal dev client
preview       Internal distribution, Android APK
production    Store-ready AAB and iOS archive
