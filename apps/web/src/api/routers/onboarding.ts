import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

// Define schemas locally to avoid import issues
const BiometricsSchema = z.object({
  age: z.number().min(13, "Must be at least 13 years old").max(120, "Invalid age"),
  height: z.number().min(100, "Height must be at least 100cm").max(250, "Height must be less than 250cm"),
  weight: z.number().min(30, "Weight must be at least 30kg").max(300, "Weight must be less than 300kg"),
  gender: z.enum(["male", "female", "other"]),
});

const OnboardingInputSchema = z.object({
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  fitnessGoals: z.array(z.string()),
  availableTime: z.number().min(15).max(180),
  biometrics: BiometricsSchema,
});

const OnboardingStatusSchema = z.object({
  isCompleted: z.boolean(),
  completedAt: z.coerce.date().optional(),
  currentStep: z.number().min(1).max(3),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

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

        // Update user profile with biometrics (use set with merge to handle new/existing docs)
        const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
        await userRef.doc("main").set({
          biometrics: input.biometrics,
          updatedAt: new Date(),
        }, { merge: true });

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
          experienceLevel: "beginner",
        };
      }

      const onboardingData = onboardingDoc.data();
      return OnboardingStatusSchema.parse({
        isCompleted: onboardingData?.isCompleted || false,
        completedSteps: onboardingData?.completedSteps || [],
        currentStep: onboardingData?.currentStep || "goal_selection",
        experienceLevel: onboardingData?.experienceLevel || "beginner",
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
