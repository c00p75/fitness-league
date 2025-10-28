import { z } from "zod";

export const FitnessGoalSchema = z.enum([
  "build_strength",
  "lose_weight", 
  "gain_muscle",
  "improve_endurance",
  "general_fitness",
  "flexibility",
  "sport_specific"
]);

export const ExperienceLevelSchema = z.enum([
  "beginner",
  "intermediate", 
  "advanced"
]);

export const WorkoutPreferencesSchema = z.object({
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

export const OnboardingInputSchema = z.object({
  fitnessGoal: FitnessGoalSchema,
  experienceLevel: ExperienceLevelSchema,
  biometrics: z.object({
    age: z.number().min(13).max(120),
    height: z.number().min(100).max(250),
    weight: z.number().min(30).max(300),
    gender: z.enum(["male", "female"]),
  }),
  workoutPreferences: WorkoutPreferencesSchema,
});

export const OnboardingStatusSchema = z.object({
  isCompleted: z.boolean(),
  completedSteps: z.array(z.string()),
  currentStep: z.string().optional(),
});

export type FitnessGoal = z.infer<typeof FitnessGoalSchema>;
export type ExperienceLevel = z.infer<typeof ExperienceLevelSchema>;
export type WorkoutPreferences = z.infer<typeof WorkoutPreferencesSchema>;
export type OnboardingInput = z.infer<typeof OnboardingInputSchema>;
export type OnboardingStatus = z.infer<typeof OnboardingStatusSchema>;
