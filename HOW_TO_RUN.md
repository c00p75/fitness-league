# How to Run Fitness League

## Quick Start

Run the app with Firebase emulators in **development mode**:

```bash
# Terminal 1: Start Firebase Emulators
firebase emulators:start

# Terminal 2: Start Vite Dev Server
pnpm --filter @fitness-league/web run dev
```

Then open your browser to:
- **App**: http://localhost:5173
- **Firebase Emulator UI**: http://localhost:4000

## Detailed Instructions

### 1. Development Mode (Recommended)

**Terminal 1 - Firebase Emulators:**
```bash
firebase emulators:start
```
This starts:
- Auth Emulator (port 9098)
- Firestore Emulator (port 8079)
- Storage Emulator (port 9198)
- Emulator UI (port 4000)

**Terminal 2 - Vite Dev Server:**
```bash
pnpm --filter @fitness-league/web run dev
```
Starts the React app at http://localhost:5173

### 2. Production Build

To build for production:
```bash
pnpm --filter @fitness-league/web run build
pnpm --filter @fitness-league/web run preview
```

### 3. Deploy to Firebase

```bash
# Build the app
pnpm --filter @fitness-league/web run build

# Deploy hosting
firebase deploy --only hosting

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

## What Changed?

Before:
- Needed Express server on localhost:3001
- Complex setup with tRPC client/server communication

After:
- Pure client-side app
- Direct Firestore access
- No server needed!
- Simpler, faster, cleaner

## Firebase Emulator Data

Data persists in `.firebase/emulators/firestore` (and similar for auth/storage).

To reset:
```bash
# Stop emulators
# Delete `.firebase` directory
firebase emulators:start
```

## Troubleshooting

**Problem**: App shows connection errors  
**Solution**: Make sure Firebase emulators are running

**Problem**: Build fails  
**Solution**: Run `pnpm install` to ensure all dependencies are installed

**Problem**: Auth doesn't work  
**Solution**: Check that Firebase Auth emulator is running on port 9098

