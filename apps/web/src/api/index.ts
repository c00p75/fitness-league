import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { onboardingRouter } from "./routers/onboarding";

// Create the main app router
export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  onboarding: onboardingRouter,
});

// Export the router type for client use
export type AppRouter = typeof appRouter;
