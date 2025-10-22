/**
 * Example: Using @fitness-league/env in a Vite + React frontend
 * 
 * This file demonstrates how to use the env package in a frontend application.
 * The env package automatically detects that it's running in a Vite environment
 * and uses import.meta.env instead of process.env.
 */

import { env } from "@fitness-league/env";

// ✅ All environment variables are validated and type-safe
console.log("Firebase Project ID:", env.FIREBASE_PROJECT_ID);
console.log("Environment:", env.NODE_ENV);

// ✅ Firebase configuration
export const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

// ✅ Optional variables (undefined in browser)
console.log("Admin Project ID:", env.FIREBASE_ADMIN_PROJECT_ID); // undefined in browser

// ✅ TypeScript knows the types
const isDevelopment = env.NODE_ENV === "development";
const region = env.FIREBASE_FUNCTIONS_REGION; // string

// ✅ Usage in React components
export function MyComponent() {
  return (
    <div>
      <h1>App running in {env.NODE_ENV} mode</h1>
      <p>Firebase Project: {env.FIREBASE_PROJECT_ID}</p>
    </div>
  );
}
