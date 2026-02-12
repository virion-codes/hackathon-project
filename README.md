# Study Spot

A Samsung mobile app (React Native / Expo) that helps students balance social and school life by studying together in groups. Discord-style: admins create groups by interests, school level, and school; members post meetups with **location**, **expectations**, and **timeframe**.

## Screens (from wireframe)

- **Login** – Email/password, Sign In, Forgot password
- **Home** – Left sidebar (profile + groups), Recent Messages (post previews), bottom nav
- **Discovery** – Search bar, list of groups (interest, level, school)
- **Group Chat** – Group header, chat messages, meetup post card (location, expectations, timeframe), message input
- **Account** – My Account, Settings, Support (Help Centre, Community Rules, About), Sign Out

## Run on Samsung / Android

```bash
cd study-spot
npm install
npx expo start
```

If you see **EMFILE: too many open files**, raise the limit once in this terminal then start again:

```bash
ulimit -n 65536
npx expo start
```

Or install [Watchman](https://facebook.github.io/watchman/) (`brew install watchman`) so Metro uses fewer watchers.

Then press **a** for Android emulator or scan the QR code with the Expo Go app on your Samsung phone.

## Run on device with Expo Go

1. Install **Expo Go** from the Play Store on your Samsung phone.
2. Run `npx expo start` and scan the QR code with Expo Go (or the camera app if it’s linked).
3. The app will load in Expo Go.

## Tech stack

- **Expo SDK 50** + **React Native**
- **React Navigation** (stack + bottom tabs)
- Mock data for groups, posts, and messages (no backend yet)

All UI is built to match the provided wireframes (Login, Home, Discovery, Group-Chat, Account).
