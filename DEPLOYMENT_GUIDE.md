# Firebase Deployment Guide

## Current Status

Your project has **68 TypeScript errors** that prevent a successful build. Before deploying to Firebase, these need to be fixed.

## Deployment Architecture

This project uses:
- **Frontend**: React app (static hosting on Firebase Hosting)
- **Backend**: tRPC API routes that require server-side execution
- **Challenge**: Firebase Hosting only serves static files - it cannot run your tRPC backend

## Deployment Options

### Option 1: Quick Fix & Deploy Frontend Only
Since your backend can't run on Firebase Hosting, you'd need to deploy it separately (e.g., Vercel, Railway, or Cloud Run).

### Option 2: Add Firebase Functions (Recommended)
Create a Firebase Functions directory to host your tRPC API backend.

## Steps to Deploy

### 1. Fix TypeScript Errors

The main errors are in:
- `apps/web/src/api/routers/videos.ts` - Missing type definitions for exercise objects
- `apps/web/src/components/goals/WorkoutGoalUpdateModal.tsx` - Missing goal properties (targetValue, type, unit, currentValue)
- Various unused variables and missing properties

### 2. Build the Application

```bash
pnpm build
```

### 3. Deploy to Firebase

```bash
# Deploy frontend only
firebase deploy --only hosting

# Deploy frontend + Firestore rules
firebase deploy --only hosting,firestore
```

### 4. Backend Deployment

You'll need to deploy your backend separately:
- Deploy `server.ts` Express server to Railway, Render, or similar
- Or set up Firebase Functions to host the tRPC routes

## Environment Variables

Make sure to set up environment variables for production:
1. Go to Firebase Console > Project Settings
2. Get your Firebase configuration
3. Set up environment variables in your deployment platform

## Quick Commands

```bash
# Build
pnpm build

# Deploy hosting only
firebase deploy --only hosting

# Deploy everything
firebase deploy

# Check Firebase project
firebase projects:list

# Use specific project
firebase use fit-league-930c6
```

## Next Steps

1. Fix the TypeScript errors
2. Decide on backend deployment strategy
3. Configure environment variables
4. Deploy frontend to Firebase Hosting
5. Deploy backend to your chosen platform


