import { envSchema, type Env } from "./schema";

/**
 * Universal environment variable loader that works in both Node.js and Vite environments
 * Automatically detects the runtime and uses the appropriate environment source
 */
export function createEnv(): Env {
  // Detect if we're in a browser environment with Vite
  const isViteEnvironment = typeof window !== 'undefined' && 
    typeof import.meta !== 'undefined' && 
    (import.meta as any)?.env;

  let rawEnv: Record<string, string | undefined>;

  if (isViteEnvironment) {
    // Vite environment - use import.meta.env
    const viteEnv = (import.meta as any).env;
    
    rawEnv = {
      FIREBASE_PROJECT_ID: viteEnv.VITE_FIREBASE_PROJECT_ID,
      FIREBASE_API_KEY: viteEnv.VITE_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: viteEnv.VITE_FIREBASE_AUTH_DOMAIN,
      FIREBASE_STORAGE_BUCKET: viteEnv.VITE_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: viteEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: viteEnv.VITE_FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: viteEnv.VITE_FIREBASE_MEASUREMENT_ID,
      FIREBASE_FUNCTIONS_REGION: viteEnv.VITE_FIREBASE_FUNCTIONS_REGION,
      NODE_ENV: viteEnv.VITE_NODE_ENV || viteEnv.MODE,
      // Optional server-side variables (won't be available in browser)
      FIREBASE_ADMIN_PROJECT_ID: undefined,
      FIREBASE_ADMIN_CLIENT_EMAIL: undefined,
      FIREBASE_ADMIN_PRIVATE_KEY: undefined,
      GOOGLE_FIT_CLIENT_ID: viteEnv.VITE_GOOGLE_FIT_CLIENT_ID,
      APPLE_HEALTH_CLIENT_ID: viteEnv.VITE_APPLE_HEALTH_CLIENT_ID,
    };
  } else {
    // Node.js environment - use process.env
    rawEnv = {
      FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
      FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
      FIREBASE_FUNCTIONS_REGION: process.env.VITE_FIREBASE_FUNCTIONS_REGION || process.env.FIREBASE_FUNCTIONS_REGION,
      NODE_ENV: process.env.VITE_NODE_ENV || process.env.NODE_ENV,
      // Server-side variables
      FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
      FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
      GOOGLE_FIT_CLIENT_ID: process.env.VITE_GOOGLE_FIT_CLIENT_ID || process.env.GOOGLE_FIT_CLIENT_ID,
      APPLE_HEALTH_CLIENT_ID: process.env.VITE_APPLE_HEALTH_CLIENT_ID || process.env.APPLE_HEALTH_CLIENT_ID,
    };
  }

  // Validate environment variables
  const result = envSchema.safeParse(rawEnv);
  
  if (!result.success) {
    const errorMessage = "❌ Invalid environment variables:";
    const fieldErrors = result.error.flatten().fieldErrors;
    
    console.error(errorMessage);
    console.error(JSON.stringify(fieldErrors, null, 2));
    
    // In development, show helpful error messages
    if (rawEnv.NODE_ENV === "development") {
      console.error("\n💡 Make sure you have a .env.local file with the required variables:");
      console.error("   VITE_FIREBASE_PROJECT_ID=your_project_id");
      console.error("   VITE_FIREBASE_API_KEY=your_api_key");
      console.error("   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain");
      console.error("   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket");
      console.error("   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id");
      console.error("   VITE_FIREBASE_APP_ID=your_app_id");
    }
    
    throw new Error("Invalid environment variables");
  }
  
  return result.data;
}

// Create and export the validated environment
export const env = createEnv();

// Re-export types
export type { Env };
