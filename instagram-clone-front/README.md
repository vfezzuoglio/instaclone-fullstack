# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## Connect to InstaClone API

The app now uses the ASP.NET backend instead of local mock data.

## Set up Firebase Auth

This app now uses Firebase for login and signup.

1. In Firebase Console:
   - Create a project
   - Open Authentication and enable Email/Password provider
   - Open Project Settings and copy your web app config values

2. Create `.env` in this folder and add:

   ```bash
   EXPO_PUBLIC_API_BASE_URL=http://localhost:5042
   EXPO_PUBLIC_FIREBASE_API_KEY=your_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. Restart Expo after changing `.env`.

Important:
- The frontend now sends Firebase ID tokens to the backend as Bearer tokens.
- Your backend must be configured to validate Firebase tokens for protected endpoints.

1. Start the backend API:

   ```bash
   cd ../instagram-clone/InstaClone.Api
   dotnet run
   ```

   The API runs on `http://localhost:5042` by default.

2. Configure the frontend API base URL:

   Create a `.env` file in this folder and set:

   ```bash
   EXPO_PUBLIC_API_BASE_URL=http://localhost:5042
   ```

   Notes:
   - Android emulator usually needs `http://10.0.2.2:5042`
   - Physical device should use your computer's LAN IP, like `http://192.168.1.20:5042`

3. Start the frontend:

   ```bash
   npm start
   ```

Implemented API calls:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/posts/feed`
- `POST /api/posts`
- `POST /api/posts/{postId}/like`
- `DELETE /api/posts/{postId}/like`

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
