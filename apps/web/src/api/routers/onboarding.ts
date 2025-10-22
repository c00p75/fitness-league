import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { OnboardingInputSchema, OnboardingStatusSchema } from "@fitness-league/shared";

export const onboardingRouter = router({
  // Submit onboarding data
  submitOnboarding: protectedProcedure
    .input(OnboardingInputSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const onboardingRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/onboarding`);
        
        // Check if onboarding already completed
        const existingOnboarding = await onboardingRef.doc("data").get();
        if (existingOnboarding.exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Onboarding already completed",
          });
        }

        // Save onboarding data
        await onboardingRef.doc("data").set({
          ...input,
          isCompleted: true,
          completedAt: new Date(),
          createdAt: new Date(),
        });

        // Update user profile with biometrics
        const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
        await userRef.doc("main").update({
          biometrics: input.biometrics,
          updatedAt: new Date(),
        });

        return {
          success: true,
          message: "Onboarding completed successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save onboarding data",
        });
      }
    }),

  // Get onboarding status
  getOnboardingStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth?.uid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const onboardingRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/onboarding`);
      const onboardingDoc = await onboardingRef.doc("data").get();

      if (!onboardingDoc.exists) {
        return {
          isCompleted: false,
          completedSteps: [],
          currentStep: "goal_selection",
        };
      }

      const onboardingData = onboardingDoc.data();
      return OnboardingStatusSchema.parse({
        isCompleted: onboardingData?.isCompleted || false,
        completedSteps: onboardingData?.completedSteps || [],
        currentStep: onboardingData?.currentStep || "goal_selection",
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch onboarding status",
      });
    }
  }),

  // Reset onboarding (for testing/admin purposes)
  resetOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.auth?.uid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const onboardingRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/onboarding`);
      await onboardingRef.doc("data").delete();

      return {
        success: true,
        message: "Onboarding reset successfully",
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to reset onboarding",
      });
    }
  }),
});
