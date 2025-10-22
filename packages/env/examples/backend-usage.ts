/**
 * Example: Using @fitness-league/env in a Node.js backend
 * 
 * This file demonstrates how to use the env package in a backend application.
 * The env package automatically detects that it's running in a Node.js environment
 * and uses process.env instead of import.meta.env.
 */

import { env } from "@fitness-league/env";

// ✅ All environment variables are validated and type-safe
console.log("Firebase Project ID:", env.FIREBASE_PROJECT_ID);
console.log("Environment:", env.NODE_ENV);

// ✅ Firebase Admin configuration (only available in Node.js)
export const firebaseAdminConfig = {
  projectId: env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY,
};

// ✅ Firebase client configuration
export const firebaseClientConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

// ✅ TypeScript knows the types
const isDevelopment = env.NODE_ENV === "development";
const region = env.FIREBASE_FUNCTIONS_REGION; // string

// ✅ Usage in Express/API routes
export function createApiHandler() {
  return (req: any, res: any) => {
    res.json({
      environment: env.NODE_ENV,
      projectId: env.FIREBASE_PROJECT_ID,
      region: env.FIREBASE_FUNCTIONS_REGION,
    });
  };
}

// ✅ Usage in Firebase Functions
export function myCloudFunction() {
  console.log(`Function running in ${env.NODE_ENV} mode`);
  console.log(`Firebase Project: ${env.FIREBASE_PROJECT_ID}`);
  
  // Server-side variables are available
  if (env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    console.log("Admin SDK configured");
  }
}
