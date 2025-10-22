import { z } from "zod";

export const GoalTypeSchema = z.enum([
  "weight_loss",
  "weight_gain", 
  "strength_gain",
  "endurance_improvement",
  "flexibility",
  "muscle_gain",
  "general_fitness"
]);

export const GoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: GoalTypeSchema,
  targetValue: z.number().positive("Target value must be positive"),
  currentValue: z.number().min(0, "Current value cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  startDate: z.date(),
  targetDate: z.date(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateGoalSchema = z.object({
  type: GoalTypeSchema,
  targetValue: z.number().positive("Target value must be positive"),
  currentValue: z.number().min(0, "Current value cannot be negative").optional().default(0),
  unit: z.string().min(1, "Unit is required"),
  targetDate: z.date().min(new Date(), "Target date must be in the future"),
});

export const UpdateGoalSchema = z.object({
  targetValue: z.number().positive("Target value must be positive").optional(),
  currentValue: z.number().min(0, "Current value cannot be negative").optional(),
  targetDate: z.date().min(new Date(), "Target date must be in the future").optional(),
  isActive: z.boolean().optional(),
});

export type GoalType = z.infer<typeof GoalTypeSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;
export type UpdateGoalInput = z.infer<typeof UpdateGoalSchema>;
