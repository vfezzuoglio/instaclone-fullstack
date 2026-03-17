import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

const fallbackConfig = {
  apiKey: "AIzaSyA55EVxcHcHAtQNWLhGBRcirHr3Tf0zahk",
  authDomain: "instaclone-617e2.firebaseapp.com",
  projectId: "instaclone-617e2",
  storageBucket: "instaclone-617e2.firebasestorage.app",
  messagingSenderId: "641719532054",
  appId: "1:641719532054:web:f254c71bd8998a8c3c1337",
};

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    fallbackConfig.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || fallbackConfig.appId,
};

if (!firebaseConfig.apiKey) {
  throw new Error("Missing Firebase API key configuration.");
}

const app = initializeApp(firebaseConfig);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { app, auth };
