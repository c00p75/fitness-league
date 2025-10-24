import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

// Define schemas locally to avoid import issues
const CreateWorkoutPlanSchema = z.object({
  goalId: z.string(),
  durationWeeks: z.number().min(1).max(52),
  workoutsPerWeek: z.number().min(1).max(7),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  duration: z.number().min(15).max(90).optional(),
  equipment: z.array(z.string()).optional(),
  timePreference: z.enum(["morning", "afternoon", "evening", "night"]).optional(),
  intensity: z.enum(["low", "moderate", "high", "variable"]).optional(),
  focusAreas: z.array(z.string()).optional(),
  customPlanName: z.string().max(50).optional(),
});

const UpdateWorkoutSessionSchema = z.object({
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

// Helper function to get onboarding data
async function getOnboardingData(ctx: any) {
  const onboardingDoc = await ctx.db
    .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/onboarding`)
    .doc("data")
    .get();
  
  if (!onboardingDoc.exists) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Onboarding data not found" });
  }
  
  return onboardingDoc.data();
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
async function getRecommendedExercises(goalType: string, experienceLevel: string, ctx: any, input?: any) {
  // Get exercises from the public collection
  const exercisesSnapshot = await ctx.db
    .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
    .get();
  
  const allExercises = exercisesSnapshot.docs.map((doc: any) => ({ 
    id: doc.id, 
    ...doc.data() as any 
  }));
  
  // Filter exercises based on goal, experience level, and preferences
  let recommendedExercises = allExercises.filter((exercise: any) => {
    // Filter by experience level
    if (exercise.difficulty === "advanced" && experienceLevel === "beginner") {
      return false;
    }
    
    // Filter by equipment if specified
    if (input?.equipment && input.equipment.length > 0) {
      const hasMatchingEquipment = exercise.equipment?.some((eq: string) => 
        input.equipment.includes(eq)
      );
      if (!hasMatchingEquipment) return false;
    }
    
    // Filter by focus areas if specified
    if (input?.focusAreas && input.focusAreas.length > 0) {
      const hasMatchingMuscleGroup = exercise.muscleGroups?.some((mg: string) => 
        input.focusAreas.some((fa: string) => 
          mg.toLowerCase().includes(fa.toLowerCase()) || 
          fa.toLowerCase().includes(mg.toLowerCase())
        )
      );
      if (!hasMatchingMuscleGroup) return false;
    }
    
    // Filter by goal type
    switch (goalType) {
      case "weight_loss":
        return ["cardio", "hiit"].includes(exercise.category);
      case "muscle_gain":
      case "strength_gain":
        return ["strength"].includes(exercise.category);
      case "flexibility":
        return ["yoga", "pilates", "mobility"].includes(exercise.category);
      case "endurance_improvement":
        return ["cardio", "hiit"].includes(exercise.category);
      case "general_fitness":
        return true;
      default:
        return true;
    }
  });
  
  // Prioritize exercises with YouTube videos
  recommendedExercises.sort((a: any, b: any) => {
    if (a.youtubeVideoId && !b.youtubeVideoId) return -1;
    if (!a.youtubeVideoId && b.youtubeVideoId) return 1;
    return 0;
  });
  
  // Return top 6-8 exercises
  return recommendedExercises.slice(0, 8);
}

// Helper function to create workout plan
function createWorkoutPlan(input: any, exercises: any[]) {
  // Use custom name if provided, otherwise generate smart default
  const planName = input.customPlanName || `${input.durationWeeks}-Week Plan`;
  
  const planExercises = exercises.map(exercise => ({
    exerciseId: exercise.id,
    name: exercise.name,
    category: exercise.category,
    description: exercise.description,
    difficulty: exercise.difficulty,
    instructions: exercise.instructions,
    youtubeVideoId: exercise.youtubeVideoId,
    videoThumbnail: exercise.videoThumbnail,
    videoDuration: exercise.videoDuration,
    muscleGroups: exercise.muscleGroups,
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

      // Fetch onboarding data and goal
      const onboardingData = await getOnboardingData(ctx);
      const goal = await getGoal(ctx, input.goalId);
      
      // Generate plan based on goal, experience level, and preferences
      const exercises = await getRecommendedExercises(
        goal.type, 
        onboardingData.experienceLevel, 
        ctx,
        input // Pass the full input with equipment, focusAreas, etc.
      );
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
    .input(z.object({ 
      goalId: z.string().optional() 
    }).optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      let query = ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutPlans`)
        .orderBy('createdAt', 'desc');

      // Filter by goalId if provided
      if (input?.goalId) {
        query = query.where('goalId', '==', input.goalId);
      }

      const plansSnapshot = await query.get();

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
