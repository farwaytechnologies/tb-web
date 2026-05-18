# TechBorg Mobile App

React Native (Expo) mobile app for the TechBorg learning platform.

## Setup

```bash
cd MobileApp
npm install
```

## Configure API URL

Edit `src/api/client.js` and set `BASE_URL` to your backend:

- **Emulator (Android)**: `http://10.0.2.2:8000`
- **Physical device**: `http://<your-machine-LAN-IP>:8000`
- **Production**: `https://your-api-domain.com`

## Run

```bash
# Start Expo dev server
npm start

# Android
npm run android

# iOS
npm run ios
```

Scan the QR code with the **Expo Go** app on your phone.

## Features

- Login / Register / Forgot Password
- Browse & search courses
- Course detail with module list
- Video-based course player with progress tracking
- My Learning (enrolled courses)
- Exams with countdown timer and results
- Community posts, likes, comments
- Job listings and applications
- Notifications
- Certificates with share
- Profile editing

## Tech Stack

- Expo SDK 51
- React Navigation (Stack + Bottom Tabs)
- Axios for API calls
- AsyncStorage for session persistence
- WebView for video playback
- Expo Linear Gradient, Vector Icons
