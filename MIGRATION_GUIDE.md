# tRPC to REST Migration Guide

This document outlines the migration from tRPC to standard REST APIs.

## Summary of Changes

### What Was Created
1. ✅ `apps/web/src/utils/httpClient.ts` - Generic HTTP client with Firebase auth
2. ✅ `apps/web/src/utils/authMiddleware.ts` - Authentication middleware for Express
3. ✅ `apps/web/src/api/handlers/goals.ts` - Example REST API handler

### What Needs to Be Done

#### 1. Create REST API Route Files (9 endpoints needed)
Based on the existing tRPC routers, create handlers for:
- Goals: `getGoals`, `createGoal`, `updateGoalProgress`, `deleteGoal`, `getGoal`
- Workouts: `generatePlan`, `getPlans`, `deletePlan`, etc.
- User: `getProfile`, `updateProfile`
- Auth: `getCurrentUser`, `createUserProfile`
- Exercises, Videos, Onboarding

#### 2. Update Express Server (`apps/web/server.ts`)
Replace tRPC middleware with REST API routes:
```typescript
import express from 'express';
import { authMiddleware } from './src/utils/authMiddleware';
import { getGoalsHandler, createGoalHandler, ... } from './src/api/handlers/goals';
// ... import other handlers

const app = express();
app.use(express.json());

// Goals API
app.get('/api/goals/list', authMiddleware, getGoalsHandler);
app.post('/api/goals/create', authMiddleware, createGoalHandler);
app.get('/api/goals/:goalId', authMiddleware, getGoalHandler);
app.delete('/api/goals/:goalId', authMiddleware, deleteGoalHandler);
// ... etc
```

#### 3. Update Client-Side Code (16 files)
Replace all tRPC hooks with `restFetch` calls:

**Before (tRPC):**
```typescript
const { data: goals } = trpc.goals.getGoals.useQuery();
const createGoal = trpc.goals.createGoal.useMutation();
```

**After (REST):**
```typescript
// In queries
const { data: goals } = useQuery({
  queryKey: ['goals'],
  queryFn: () => restFetch('/api/goals/list'),
});

// In mutations
const createGoal = useMutation({
  mutationFn: (data) => restFetch('/api/goals/create', {
    method: 'POST',
    body: data,
  }),
});
```

#### 4. Files to Update

**Client files (16 files):**
- `apps/web/src/pages/dashboard/DashboardPage.tsx`
- `apps/web/src/pages/goals/GoalsPage.tsx`
- `apps/web/src/pages/goals/GoalDetailPage.tsx`
- `apps/web/src/pages/workouts/WorkoutsPage.tsx`
- `apps/web/src/pages/workouts/WorkoutDetailPage.tsx`
- `apps/web/src/pages/videos/VideosPage.tsx`
- `apps/web/src/pages/profile/ProfilePage.tsx`
- `apps/web/src/pages/onboarding/OnboardingPage.tsx`
- `apps/web/src/components/workouts/PlanGenerator.tsx`
- `apps/web/src/components/workouts/UpdateWorkoutModal.tsx`
- `apps/web/src/components/goals/CreateGoalModal.tsx`
- `apps/web/src/components/goals/EditGoalModal.tsx`
- `apps/web/src/components/goals/WorkoutGoalUpdateModal.tsx`
- `apps/web/src/components/goals/UpdateProgressModal.tsx`
- Plus others

#### 5. Delete Files
- `apps/web/server.ts` (replace with new version)
- `apps/web/src/lib/trpc.ts`
- `apps/web/src/lib/trpc-provider.tsx`
- `apps/web/src/pages/api/trpc/[trpc].ts`
- tRPC router files (keep the logic, but files will be replaced)

#### 6. Update Main Entry Point
In `apps/web/src/main.tsx`:
- Remove TRPCProvider
- Remove trpc imports
- Update to use standard React Query + fetch

## Next Steps

This migration is extensive. The pattern is established in:
- `apps/web/src/utils/httpClient.ts` - For client-side calls
- `apps/web/src/api/handlers/goals.ts` - For server-side handlers

Would you like me to:
1. Complete the entire migration (all files)?
2. Create all API handlers first?
3. Focus on updating specific client files?

