import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
// import { TRPCError } from "@trpc/server";

/**
 * Firebase Admin SDK Configuration
 * 
 * Development (Emulators):
 * - Set NODE_ENV=development
 * - Emulators will be used automatically
 * 
 * Production:
 * - Get service account from Firebase Console:
 *   1. Go to Project Settings > Service Accounts
 *   2. Click "Generate New Private Key"
 *   3. Extract the following from the JSON:
 *      - FIREBASE_ADMIN_PROJECT_ID
 *      - FIREBASE_ADMIN_CLIENT_EMAIL (the "client_email" field)
 *      - FIREBASE_ADMIN_PRIVATE_KEY (the "private_key" field)
 * - Set NODE_ENV=production
 */

// Set emulator hosts BEFORE initialization (only in development)
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

if (isDevelopment) {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8079';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9098';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9198';
}

// Initialize Firebase Admin
if (getApps().length === 0) {
  const config: any = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "fit-league-930c6",
  };

  // Add credentials for production
  if (!isDevelopment && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    config.credential = cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  }

  initializeApp(config);
}

export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

export interface Context {
  auth?: {
    uid: string;
    email: string | null;
    emailVerified: boolean;
  };
  db: FirebaseFirestore.Firestore;
  storage: ReturnType<typeof getStorage>;
}

export interface AuthenticatedContext extends Context {
  auth: {
    uid: string;
    email: string | null;
    emailVerified: boolean;
  };
}

export async function createContext({ req }: { req: any }): Promise<Context> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader ? "present" : "missing");
    
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No Bearer token found");
      return { db, storage };
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      console.log("No token after Bearer");
      return { db, storage };
    }

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    
    return {
      auth: {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        emailVerified: decodedToken.email_verified || false,
      },
      db,
      storage,
    };
  } catch (error) {
    // If token verification fails, return context without auth
    console.warn("Token verification failed:", error);
    return { db, storage };
  }
}
