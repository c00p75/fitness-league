import { z } from "zod";

export const WorkoutPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  goalId: z.string(),
  durationWeeks: z.number(),
  workoutsPerWeek: z.number(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    sets: z.number(),
    reps: z.number().optional(),
    duration: z.number().optional(),
    restSeconds: z.number(),
  })),
  createdAt: z.date(),
});

export const WorkoutSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  planId: z.string(),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    completed: z.boolean(),
    sets: z.array(z.object({
      reps: z.number().optional(),
      weight: z.number().optional(),
      duration: z.number().optional(),
    })),
  })),
  startedAt: z.date(),
  completedAt: z.date().optional(),
});

export const CreateWorkoutPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  goalId: z.string().min(1, "Goal is required"),
  durationWeeks: z.number().min(1, "Duration must be at least 1 week").max(52, "Duration cannot exceed 52 weeks"),
  workoutsPerWeek: z.number().min(1, "Must have at least 1 workout per week").max(7, "Cannot exceed 7 workouts per week"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export const UpdateWorkoutSessionSchema = z.object({
  sessionId: z.string(),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    completed: z.boolean(),
    sets: z.array(z.object({
      reps: z.number().optional(),
      weight: z.number().optional(),
      duration: z.number().optional(),
    })),
  })),
});

export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>;
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;
export type CreateWorkoutPlan = z.infer<typeof CreateWorkoutPlanSchema>;
export type UpdateWorkoutSession = z.infer<typeof UpdateWorkoutSessionSchema>;
