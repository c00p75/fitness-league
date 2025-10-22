import { z } from "zod";

export const envSchema = z.object({
  // Firebase Configuration
  FIREBASE_PROJECT_ID: z.string().min(1, "Firebase project ID is required"),
  FIREBASE_API_KEY: z.string().min(1, "Firebase API key is required"),
  FIREBASE_AUTH_DOMAIN: z.string().min(1, "Firebase auth domain is required"),
  FIREBASE_STORAGE_BUCKET: z.string().min(1, "Firebase storage bucket is required"),
  FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, "Firebase messaging sender ID is required"),
  FIREBASE_APP_ID: z.string().min(1, "Firebase app ID is required"),
  FIREBASE_MEASUREMENT_ID: z.string().optional(),
  
  // Firebase Functions
  FIREBASE_FUNCTIONS_REGION: z.string().default("us-central1"),
  
  // Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Optional Firebase Admin (for server-side)
  FIREBASE_ADMIN_PROJECT_ID: z.string().optional(),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().optional(),
  
  // Optional third-party services
  GOOGLE_FIT_CLIENT_ID: z.string().optional(),
  APPLE_HEALTH_CLIENT_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;
