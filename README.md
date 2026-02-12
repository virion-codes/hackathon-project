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

Then press **a** for Android emulator, **i** for iOS simulator, or scan the QR code to open in Expo Go.

**Important – QR code scanning on iOS & Android:** To avoid "no usable data found", **open the Expo Go app first**, then use **"Scan QR code"** from inside Expo Go (do not use the system Camera app). If the QR code still fails, run `npm run start:tunnel` instead for a tunnel connection.

### iOS Simulator not working

If pressing **i** fails with “Can't determine id of Simulator app” or no simulator is found:

1. **Install an iOS Simulator runtime**  
   Open **Xcode** → **Settings** (⌘,) → **Platforms** (or **Components**). Under **iOS**, click **+** or **Get** to download a simulator runtime (e.g. iOS 17 or 18).

2. **Point the command line to Xcode** (if needed):  
   `sudo xcode-select -s /Applications/Xcode.app`

3. Restart the terminal, run `npx expo start` again, then press **i**.

You can also run the app on a physical **iPhone** by installing **Expo Go** from the App Store and scanning the QR code—no simulator required.

## Run on device with Expo Go

1. Install **Expo Go** from the Play Store on your Samsung phone.
2. Run `npx expo start` and scan the QR code with Expo Go (or the camera app if it’s linked).
3. The app will load in Expo Go.

## Tech stack

- **Expo SDK 54** + **React Native**
- **React Navigation** (stack + bottom tabs)
- Mock data for groups, posts, and messages (no backend yet)

All UI is built to match the provided wireframes (Login, Home, Discovery, Group-Chat, Account).

## Publish to GitHub

The project is already a git repo with an initial commit. To put it on a new GitHub repo:

1. **Create a new repo on GitHub**  
   Go to [github.com/new](https://github.com/new). Name it e.g. `study-spot`, leave “Add a README” **unchecked**, then click **Create repository**.

2. **Add the remote and push** (replace `YOUR_USERNAME` and `study-spot` if you used a different repo name):

   ```bash
   cd "/Users/skyler/Hackathon Project/study-spot"
   git remote add origin https://github.com/YOUR_USERNAME/study-spot.git
   git branch -M main
   git push -u origin main
   ```

   If you use SSH: `git remote add origin git@github.com:YOUR_USERNAME/study-spot.git` then run the same `git push` commands.
