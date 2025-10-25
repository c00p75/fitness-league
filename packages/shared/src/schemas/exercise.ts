import { z } from "zod";

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["cardio", "strength", "hiit", "yoga", "pilates", "mobility"]),
  description: z.string(),
  duration: z.number(),
  calorieEstimate: z.number(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  equipment: z.array(z.string()),
  instructions: z.array(z.string()),
  youtubeVideoId: z.string().optional(),
  videoThumbnail: z.string().url().optional(),
  videoDuration: z.number().optional(),
  muscleGroups: z.array(z.string()),
});

export const ExerciseSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  equipment: z.string().optional(),
});

export const ExerciseFilterSchema = z.object({
  categories: z.array(z.string()).optional(),
  difficulties: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  muscleGroups: z.array(z.string()).optional(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;
export type ExerciseSearch = z.infer<typeof ExerciseSearchSchema>;
export type ExerciseFilter = z.infer<typeof ExerciseFilterSchema>;
