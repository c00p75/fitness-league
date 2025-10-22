import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
// import { TRPCError } from "@trpc/server";
import { env } from "@fitness-league/env";

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    projectId: env.FIREBASE_PROJECT_ID,
    credential: env.FIREBASE_ADMIN_PROJECT_ID 
      ? cert({
          projectId: env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
      : undefined,
  });
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

export async function createContext({ req }: { req: any }): Promise<Context> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return { db, storage };
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
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
