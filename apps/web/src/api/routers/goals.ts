import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

// Define schemas locally to avoid import issues
const CreateGoalSchema = z.object({
  type: z.enum(["weight_loss", "muscle_gain", "flexibility", "general_fitness", "endurance_improvement", "strength_gain"]),
  targetValue: z.number().min(0.1, "Target value must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  targetDate: z.coerce.date(),
  startDate: z.coerce.date().optional(),
});

const PROJECT_ID = "fit-league-930c6";

export const goalsRouter = router({
  // Get all user goals
  getGoals: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const goalsSnapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/goals`)
        .orderBy("createdAt", "desc")
        .get();

      return goalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        startDate: doc.data().startDate?.toDate(),
        targetDate: doc.data().targetDate?.toDate(),
      }));
    }),

  // Create new goal
  createGoal: protectedProcedure
    .input(CreateGoalSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const goalRef = ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/goals`)
        .doc();

      const goalData = {
        ...input,
        userId: ctx.auth.uid,
        currentValue: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await goalRef.set(goalData);

      return {
        id: goalRef.id,
        ...goalData,
      };
    }),

  // Update goal progress
  updateGoalProgress: protectedProcedure
    .input(z.object({ 
      goalId: z.string(),
      currentValue: z.number().min(0, "Current value cannot be negative"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/goals`)
        .doc(input.goalId)
        .update({ 
          currentValue: input.currentValue, 
          updatedAt: new Date() 
        });

      return { success: true };
    }),

  // Update goal
  updateGoal: protectedProcedure
    .input(z.object({
      goalId: z.string(),
      type: z.string().optional(),
      targetValue: z.number().optional(),
      unit: z.string().optional(),
      targetDate: z.coerce.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const updateData: any = { updatedAt: new Date() };
      if (input.type) updateData.type = input.type;
      if (input.targetValue !== undefined) updateData.targetValue = input.targetValue;
      if (input.unit) updateData.unit = input.unit;
      if (input.targetDate) updateData.targetDate = input.targetDate;

      await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/goals`)
        .doc(input.goalId)
        .update(updateData);

      return { success: true };
    }),

  // Delete goal
  deleteGoal: protectedProcedure
    .input(z.object({ goalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/goals`)
        .doc(input.goalId)
        .delete();

      return { success: true };
    }),

  // Get single goal
  getGoal: protectedProcedure
    .input(z.object({ goalId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const goalDoc = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/goals`)
        .doc(input.goalId)
        .get();

      if (!goalDoc.exists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Goal not found" });
      }

      const data = goalDoc.data()!;
      return {
        id: goalDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        startDate: data.startDate?.toDate(),
        targetDate: data.targetDate?.toDate(),
      };
    }),
});
