import { z } from "zod";
import { FitnessGoalSchema, ExperienceLevelSchema, WorkoutPreferencesSchema } from "./onboarding";

export const BiometricsSchema = z.object({
  age: z.number().min(13, "Must be at least 13 years old").max(120, "Invalid age"),
  height: z.number().min(100, "Height must be at least 100cm").max(250, "Height must be less than 250cm"),
  weight: z.number().min(30, "Weight must be at least 30kg").max(300, "Weight must be less than 300kg"),
  gender: z.enum(["male", "female", "other"]),
});

export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1, "Display name is required").max(50, "Display name too long"),
  avatarUrl: z.string().url().optional(),
  biometrics: BiometricsSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50, "Display name too long").optional(),
  biometrics: BiometricsSchema.partial().optional(),
  fitnessGoal: FitnessGoalSchema.optional(),
  experienceLevel: ExperienceLevelSchema.optional(),
  workoutPreferences: WorkoutPreferencesSchema.partial().optional(),
});

export type Biometrics = z.infer<typeof BiometricsSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
