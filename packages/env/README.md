# @fitness-league/env

Universal environment variable loader that works in both Node.js and Vite environments.

## Features

- ✅ **Universal**: Works in both Node.js (`process.env`) and Vite (`import.meta.env`)
- ✅ **Type-safe**: Full TypeScript support with Zod validation
- ✅ **Auto-detection**: Automatically detects runtime environment
- ✅ **Monorepo-safe**: No reliance on `process.cwd()` hacks
- ✅ **Fail-fast**: Validates environment variables at startup
- ✅ **Helpful errors**: Clear error messages in development

## Installation

```bash
pnpm add @fitness-league/env
```

## Usage

### Frontend (Vite + React)

```typescript
// apps/web/src/lib/firebase.ts
import { env } from "@fitness-league/env";

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  // ... other config
};
```

### Backend (Node.js)

```typescript
// functions/src/index.ts
import { env } from "@fitness-league/env";

// Same API, automatically uses process.env
console.log(env.FIREBASE_PROJECT_ID); // ✅ Works
console.log(env.FIREBASE_ADMIN_CLIENT_EMAIL); // ✅ Available in Node.js
```

### Environment Variables

Create a `.env.local` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Functions
VITE_FIREBASE_FUNCTIONS_REGION=us-central1

# Environment
VITE_NODE_ENV=development

# Optional: Server-side only (Node.js)
FIREBASE_ADMIN_PROJECT_ID=your_admin_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
```

## How It Works

1. **Auto-detection**: Checks if `window` and `import.meta.env` exist (Vite) or uses `process.env` (Node.js)
2. **Variable mapping**: Maps `VITE_*` prefixed variables to the expected names
3. **Validation**: Uses Zod schema to validate all required variables
4. **Type safety**: Returns fully typed environment object

## API

### `createEnv(): Env`

Creates a validated environment object. Automatically detects runtime.

### `env: Env`

Pre-created environment object (recommended for most use cases).

### `Env` type

TypeScript type for the environment object.

## Error Handling

If environment variables are missing or invalid, the package will:

1. Log detailed error messages
2. Show helpful setup instructions in development
3. Throw an error to prevent the app from starting

## Monorepo Usage

This package is designed to work seamlessly in monorepos:

```typescript
// In any package that depends on @fitness-league/env
import { env } from "@fitness-league/env";

// Works the same everywhere
console.log(env.FIREBASE_PROJECT_ID);
```

No need to worry about `process.cwd()` or relative paths - it just works!
