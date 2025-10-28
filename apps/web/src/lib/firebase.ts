import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { env } from "@fitness-league/env";

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV)) {
  // Only connect to emulators if not already connected
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, "http://localhost:9098");
  }
  // Check if Firestore is already connected to emulator
  try {
    connectFirestoreEmulator(db, "localhost", 8079);
  } catch (error) {
    // Already connected to emulator, ignore error
  }
  // Check if Storage is already connected to emulator
  try {
    connectStorageEmulator(storage, "localhost", 9198);
  } catch (error) {
    // Already connected to emulator, ignore error
  }
}

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
