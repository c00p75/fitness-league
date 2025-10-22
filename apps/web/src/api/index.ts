import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { onboardingRouter } from "./routers/onboarding";
import { goalsRouter } from "./routers/goals";
import { workoutsRouter } from "./routers/workouts";
import { exercisesRouter } from "./routers/exercises";

// Create the main app router
export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  onboarding: onboardingRouter,
  goals: goalsRouter,
  workouts: workoutsRouter,
  exercises: exercisesRouter,
});

// Export the router type for client use
export type AppRouter = typeof appRouter;
