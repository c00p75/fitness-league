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
  currentStep: z.union([z.number().min(1).max(3), z.string()]).optional(),
  completedSteps: z.array(z.string()).optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

// Mapping from onboarding fitness goals to goal types with default values
const createDefaultGoalFromOnboarding = (fitnessGoal: string, biometrics: any) => {
  const goalMappings = {
    build_strength: {
      type: "strength_gain",
      unit: "kg",
      defaultTarget: 20, // +20kg strength gain
      description: "Build overall strength and power"
    },
    lose_weight: {
      type: "weight_loss", 
      unit: "kg",
      defaultTarget: Math.max(5, Math.round(biometrics.weight * 0.1)), // 10% of current weight or min 5kg
      description: "Achieve a healthier weight"
    },
    gain_muscle: {
      type: "muscle_gain",
      unit: "kg", 
      defaultTarget: 5, // +5kg muscle mass
      description: "Build lean muscle mass"
    },
    improve_endurance: {
      type: "endurance_improvement",
      unit: "minutes",
      defaultTarget: 30, // 30 minutes of sustained activity
      description: "Improve cardiovascular endurance"
    },
    general_fitness: {
      type: "general_fitness",
      unit: "days",
      defaultTarget: 30, // 30 days of consistent activity
      description: "Maintain overall health and wellness"
    },
    flexibility: {
      type: "flexibility",
      unit: "minutes",
      defaultTarget: 20, // 20 minutes of daily stretching
      description: "Improve flexibility and mobility"
    },
    sport_specific: {
      type: "general_fitness", // Map to general fitness as fallback
      unit: "days",
      defaultTarget: 30,
      description: "Sport-specific training goals"
    }
  };

  const mapping = goalMappings[fitnessGoal as keyof typeof goalMappings] || goalMappings.general_fitness;
  
  console.log(`Mapping fitness goal "${fitnessGoal}" to goal type "${mapping.type}"`);
  
  // Calculate target date (8 weeks from now)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 56); // 8 weeks = 56 days

  const goalData = {
    type: mapping.type,
    targetValue: mapping.defaultTarget,
    unit: mapping.unit,
    targetDate: targetDate,
    startDate: new Date(),
    durationWeeks: 8,
    description: mapping.description,
    isActive: true
  };
  
  console.log("Final goal data:", goalData);
  return goalData;
};

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

        // Create initial goal based on the first selected fitness goal
        if (input.fitnessGoals && input.fitnessGoals.length > 0) {
          const primaryGoal = input.fitnessGoals[0];
          console.log("Creating goal for fitness goal:", primaryGoal);
          
          const goalData = createDefaultGoalFromOnboarding(primaryGoal, input.biometrics);
          console.log("Generated goal data:", goalData);
          
          // Create the goal in the goals collection
          const goalsRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/goals`);
          const goalDoc = await goalsRef.add({
            ...goalData,
            currentValue: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          
          console.log("Goal created with ID:", goalDoc.id);
        } else {
          console.log("No fitness goals provided for goal creation");
        }

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
