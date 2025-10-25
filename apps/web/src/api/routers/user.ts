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


const FitnessGoalSchema = z.enum([
  "build_strength",
  "lose_weight", 
  "gain_muscle",
  "improve_endurance",
  "general_fitness",
  "flexibility",
  "sport_specific"
]);

const ExperienceLevelSchema = z.enum([
  "beginner",
  "intermediate", 
  "advanced"
]);

const WorkoutPreferencesSchema = z.object({
  preferredDuration: z.number().min(15, "Minimum 15 minutes").max(180, "Maximum 180 minutes"),
  weeklyFrequency: z.number().min(1, "At least 1 workout per week").max(7, "Maximum 7 workouts per week"),
  availableEquipment: z.array(z.enum([
    "none",
    "dumbbells",
    "resistance_bands", 
    "yoga_mat",
    "pull_up_bar",
    "kettlebell",
    "barbell"
  ])),
  preferredTimeOfDay: z.enum(["morning", "afternoon", "evening", "flexible"]),
});

const UpdateProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50, "Display name too long").optional(),
  biometrics: BiometricsSchema.partial().optional(),
  fitnessGoal: FitnessGoalSchema.optional(),
  experienceLevel: ExperienceLevelSchema.optional(),
  workoutPreferences: WorkoutPreferencesSchema.partial().optional(),
});

const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1, "Display name is required").max(50, "Display name too long"),
  avatarUrl: z.string().url().optional(),
  biometrics: BiometricsSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Use the shared schema instead of local definition

export const userRouter = router({
  // Get user profile with onboarding data
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth?.uid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      // Fetch profile data
      const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
      const profileDoc = await userRef.doc("main").get();

      if (!profileDoc.exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User profile not found",
        });
      }

      const profileData = profileDoc.data();

      // Fetch onboarding data
      const onboardingRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/onboarding`);
      const onboardingDoc = await onboardingRef.doc("data").get();
      
      let onboardingData = {};
      if (onboardingDoc.exists) {
        const onboarding = onboardingDoc.data();
        if (onboarding) {
          onboardingData = {
            fitnessGoal: onboarding.fitnessGoals?.[0] || "general_fitness",
            experienceLevel: onboarding.experienceLevel || "beginner",
            workoutPreferences: {
              preferredDuration: onboarding.availableTime || 30,
              weeklyFrequency: 3, // Default value since not stored in onboarding
              availableEquipment: ["none"], // Default value since not stored in onboarding
              preferredTimeOfDay: "evening", // Default value since not stored in onboarding
            }
          };
        }
      }

      // Merge profile and onboarding data
      const mergedData = {
        ...profileData,
        ...onboardingData,
      };

      return UserProfileSchema.parse(mergedData);
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user profile",
      });
    }
  }),

  // Update user profile and onboarding data
  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
        const profileDoc = await userRef.doc("main").get();

        if (!profileDoc.exists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        // Separate profile and onboarding data
        const { fitnessGoal, experienceLevel, workoutPreferences, ...profileData } = input;
        
        // Update profile data
        if (Object.keys(profileData).length > 0) {
          const updateData = {
            ...profileData,
            updatedAt: new Date(),
          };
          await userRef.doc("main").update(updateData);
        }

        // Update onboarding data if provided
        if (fitnessGoal || experienceLevel || workoutPreferences) {
          const onboardingRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/onboarding`);
          const onboardingDoc = await onboardingRef.doc("data").get();
          
          const onboardingUpdate: any = {
            updatedAt: new Date(),
          };

          if (fitnessGoal) {
            onboardingUpdate.fitnessGoals = [fitnessGoal];
          }
          if (experienceLevel) {
            onboardingUpdate.experienceLevel = experienceLevel;
          }
          if (workoutPreferences) {
            if (workoutPreferences.preferredDuration) {
              onboardingUpdate.availableTime = workoutPreferences.preferredDuration;
            }
            // Store other workout preferences as needed
            onboardingUpdate.workoutPreferences = workoutPreferences;
          }

          if (onboardingDoc.exists) {
            await onboardingRef.doc("data").update(onboardingUpdate);
          } else {
            // Create onboarding document if it doesn't exist
            await onboardingRef.doc("data").set({
              ...onboardingUpdate,
              isCompleted: true,
              completedAt: new Date(),
              createdAt: new Date(),
            });
          }
        }

        return {
          success: true,
          message: "Profile updated successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    }),

  // Upload avatar
  uploadAvatar: protectedProcedure
    .input(z.object({
      imageData: z.string(), // base64 encoded image
      contentType: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        // Convert base64 to buffer
        const base64Data = (input as any).imageData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Upload to Firebase Storage
        const bucket = ctx.storage.bucket();
        const fileName = `avatars/${ctx.auth.uid}/${Date.now()}.${(input as any).contentType.split("/")[1]}`;
        const file = bucket.file(fileName);

        await file.save(buffer, {
          metadata: {
            contentType: (input as any).contentType,
          },
        });

        // Make file publicly accessible
        await file.makePublic();

        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Update user profile with new avatar URL
        const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
        await userRef.doc("main").update({
          avatarUrl: publicUrl,
          updatedAt: new Date(),
        });

        return {
          success: true,
          avatarUrl: publicUrl,
          message: "Avatar uploaded successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload avatar",
        });
      }
    }),

  // Delete avatar
  deleteAvatar: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.auth?.uid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
      await userRef.doc("main").update({
        avatarUrl: null,
        updatedAt: new Date(),
      });

      return {
        success: true,
        message: "Avatar deleted successfully",
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete avatar",
      });
    }
  }),
});
