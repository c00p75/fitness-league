# Next Steps for Complete Migration

## ✅ What's Done

The infrastructure for migrating from tRPC to REST APIs is complete:

1. **HTTP Client** (`apps/web/src/utils/httpClient.ts`)
   - Handles Firebase authentication automatically
   - Makes standard REST API calls
   - Error handling included

2. **Authentication Middleware** (`apps/web/src/utils/authMiddleware.ts`)
   - Verifies Firebase ID tokens
   - Protects all API endpoints
   - Returns 401 for unauthorized requests

3. **API Handlers** (server-side)
   - `apps/web/src/api/handlers/goals.ts`
   - `apps/web/src/api/handlers/user.ts`
   - `apps/web/src/api/handlers/workouts.ts`

4. **Client API Helpers** (`apps/web/src/api/client.ts`)
   - Type-safe API functions
   - Easy to use in components
   - Replaces tRPC client

5. **Updated Server** (`apps/web/server.ts`)
   - Removed tRPC middleware
   - Added REST API routes
   - Uses authentication middleware

## ⚠️ What Needs to Be Done

### Priority 1: Update Client Files (16 files)
These components still use tRPC and need to be converted to REST:

1. `CreateGoalModal.tsx` - Example conversion provided
2. `GoalsPage.tsx`
3. `GoalDetailPage.tsx`
4. `DashboardPage.tsx`
5. `WorkoutsPage.tsx`
6. `WorkoutDetailPage.tsx`
7. `VideosPage.tsx`
8. `ProfilePage.tsx`
9. `OnboardingPage.tsx`
10. `PlanGenerator.tsx`
11. `UpdateWorkoutModal.tsx`
12. `EditGoalModal.tsx`
13. `WorkoutGoalUpdateModal.tsx`
14. `UpdateProgressModal.tsx`

### Conversion Pattern:

**Old (tRPC):**
```typescript
import { trpc } from "../../lib/trpc";

const { data } = trpc.goals.getGoals.useQuery();
const mutation = trpc.goals.createGoal.useMutation();
```

**New (REST):**
```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { goalsApi } from "../../api/client";

const { data } = useQuery({
  queryKey: ['goals'],
  queryFn: goalsApi.list,
});

const mutation = useMutation({
  mutationFn: goalsApi.create,
});
```

### Priority 2: Additional API Handlers
Create handlers for remaining features:
- `apps/web/src/api/handlers/auth.ts`
- `apps/web/src/api/handlers/exercises.ts`
- `apps/web/src/api/handlers/videos.ts`
- `apps/web/src/api/handlers/onboarding.ts`

### Priority 3: Clean Up
Remove old tRPC infrastructure:
- Delete `apps/web/src/lib/trpc.ts`
- Delete `apps/web/src/lib/trpc-provider.tsx`
- Delete `apps/web/src/pages/api/trpc/[trpc].ts`

## 🚀 How to Test

1. **Start the development server:**
   ```bash
   pnpm dev
   ```

2. **Test the API endpoints:**
   - GET http://localhost:3001/api/goals/list
   - POST http://localhost:3001/api/goals/create
   - etc.

3. **Check the browser console** for any authentication or API errors

## 📚 Documentation

- See `MIGRATION_COMPLETE.md` for status details
- See `MIGRATION_GUIDE.md` for the original migration plan
- See `apps/web/src/api/client.ts` for all available API functions

## 🎯 Benefits of This Migration

1. **Simpler Architecture** - Standard REST APIs, no tRPC abstraction
2. **Easy Deployment** - Works with Firebase, Vercel, or any platform
3. **Direct Control** - Use fetch() directly if needed
4. **Better Testing** - Test endpoints independently
5. **Easier Debugging** - Standard HTTP requests in network tab
6. **Firebase Ready** - Perfect for Firebase Functions deployment

The pattern is now established. Complete the remaining client files following the same approach!

