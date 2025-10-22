import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { CreateWorkoutPlanSchema, UpdateWorkoutSessionSchema } from "@fitness-league/shared";

const PROJECT_ID = "fit-league-930c6";

// Helper function to get user profile
async function getUserProfile(ctx: any) {
  const profileDoc = await ctx.db
    .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/profile`)
    .doc("main")
    .get();
  
  if (!profileDoc.exists) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User profile not found" });
  }
  
  return profileDoc.data();
}

// Helper function to get goal
async function getGoal(ctx: any, goalId: string) {
  const goalDoc = await ctx.db
    .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/goals`)
    .doc(goalId)
    .get();
  
  if (!goalDoc.exists) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Goal not found" });
  }
  
  return goalDoc.data();
}

// Helper function to get recommended exercises
async function getRecommendedExercises(goalType: string, experienceLevel: string, ctx: any) {
  // Get exercises from the public collection
  const exercisesSnapshot = await ctx.db
    .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
    .get();
  
  const allExercises = exercisesSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() as any }));
  
  // Simple algorithm to recommend exercises based on goal and experience
  let recommendedExercises = allExercises.filter((exercise: any) => {
    // Filter by experience level
    if (exercise.difficulty !== experienceLevel && exercise.difficulty !== "beginner") {
      return false;
    }
    
    // Filter by goal type
    switch (goalType) {
      case "weight_loss":
        return ["cardio", "hiit"].includes(exercise.category);
      case "muscle_gain":
        return ["strength"].includes(exercise.category);
      case "flexibility":
        return ["yoga", "mobility"].includes(exercise.category);
      case "general_fitness":
        return true;
      default:
        return true;
    }
  });
  
  // Return top 6-8 exercises
  return recommendedExercises.slice(0, 8);
}

// Helper function to create workout plan
function createWorkoutPlan(input: any, exercises: any[]) {
  const planName = input.durationWeeks === 4 ? "4-Week Plan" : 
                 input.durationWeeks === 8 ? "8-Week Plan" : 
                 "12-Week Plan";
  
  const planExercises = exercises.map(exercise => ({
    exerciseId: exercise.id,
    sets: exercise.category === "cardio" ? 1 : 3,
    reps: exercise.category === "strength" ? 12 : undefined,
    duration: exercise.category === "cardio" ? 30 : undefined,
    restSeconds: exercise.category === "strength" ? 60 : 30,
  }));
  
  return {
    name: planName,
    description: `A ${input.durationWeeks}-week workout plan with ${input.workoutsPerWeek} sessions per week`,
    goalId: input.goalId,
    durationWeeks: input.durationWeeks,
    workoutsPerWeek: input.workoutsPerWeek,
    difficulty: input.difficulty || "beginner",
    exercises: planExercises,
    createdAt: new Date(),
  };
}

export const workoutsRouter = router({
  // Generate personalized workout plan
  generatePlan: protectedProcedure
    .input(CreateWorkoutPlanSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Fetch user profile and goal
      const profile = await getUserProfile(ctx);
      const goal = await getGoal(ctx, input.goalId);
      
      // Generate plan based on goal, experience level, and preferences
      const exercises = await getRecommendedExercises(goal.type, profile.experienceLevel, ctx);
      const plan = createWorkoutPlan(input, exercises);
      
      // Save to Firestore
      const planRef = ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutPlans`)
        .doc();
      
      const planData = {
        ...plan,
        userId: ctx.auth.uid,
      };
      
      await planRef.set(planData);
      
      return { id: planRef.id, ...planData };
    }),

  // Get user's workout plans
  getPlans: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const plansSnapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutPlans`)
        .orderBy('createdAt', 'desc')
        .get();

      return plansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
    }),

  // Get single workout plan
  getPlan: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const planDoc = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutPlans`)
        .doc(input.planId)
        .get();

      if (!planDoc.exists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan not found" });
      }

      return {
        id: planDoc.id,
        ...planDoc.data(),
        createdAt: planDoc.data()?.createdAt?.toDate(),
      };
    }),

  // Start workout session
  startSession: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Get the plan to initialize session exercises
      const planDoc = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutPlans`)
        .doc(input.planId)
        .get();

      if (!planDoc.exists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workout plan not found" });
      }

      const plan = planDoc.data()!;
      const sessionRef = ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutSessions`)
        .doc();

      const session = {
        planId: input.planId,
        userId: ctx.auth.uid,
        startedAt: new Date(),
        exercises: plan.exercises.map((exercise: any) => ({
          exerciseId: exercise.exerciseId,
          completed: false,
          sets: [],
        })),
      };

      await sessionRef.set(session);
      return { id: sessionRef.id, ...session };
    }),

  // Update workout session
  updateSession: protectedProcedure
    .input(UpdateWorkoutSessionSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutSessions`)
        .doc(input.sessionId)
        .update({
          exercises: input.exercises,
          updatedAt: new Date(),
        });

      return { success: true };
    }),

  // Complete workout session
  completeSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutSessions`)
        .doc(input.sessionId)
        .update({
          completedAt: new Date(),
        });

      return { success: true };
    }),

  // Get workout sessions
  getSessions: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const sessionsSnapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutSessions`)
        .orderBy('startedAt', 'desc')
        .limit(20)
        .get();

      return sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startedAt: doc.data().startedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate(),
      }));
    }),

  // Get single workout session
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const sessionDoc = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutSessions`)
        .doc(input.sessionId)
        .get();

      if (!sessionDoc.exists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workout session not found" });
      }

      return {
        id: sessionDoc.id,
        ...sessionDoc.data(),
        startedAt: sessionDoc.data()?.startedAt?.toDate(),
        completedAt: sessionDoc.data()?.completedAt?.toDate(),
      };
    }),
});
