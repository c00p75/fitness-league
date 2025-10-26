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

  // Check if exercises database is empty
  if (allExercises.length === 0) {
    console.error("No exercises found in database! Check if seed script was run.");
    return [];
  }

  console.log("Exercise filtering debug:", {
    totalExercises: allExercises.length,
    goalType,
    experienceLevel,
    equipment: input?.equipment,
    focusAreas: input?.focusAreas,
    sampleExercises: allExercises.slice(0, 3).map((e: any) => ({
      id: e.id,
      name: e.name,
      category: e.category,
      difficulty: e.difficulty,
      equipment: e.equipment
    }))
  });
  
  // Filter exercises based on goal, experience level, and preferences
  let recommendedExercises = allExercises.filter((exercise: any) => {
    // Filter by experience level
    if (exercise.difficulty === "advanced" && experienceLevel === "beginner") {
      return false;
    }
    
    // Improved equipment filtering
    if (input?.equipment && input.equipment.length > 0) {
      // If "gym_access" is selected, allow all equipment
      if (input.equipment.includes("gym_access")) {
        // Allow all exercises
      } else if (input.equipment.includes("none")) {
        // Bodyweight focus but allow minimal equipment
        const allowedEquipment = ["none", "yoga_mat", "resistance_bands"];
        const hasAllowedEquipment = !exercise.equipment || 
          exercise.equipment.length === 0 ||
          exercise.equipment.some((eq: any) => allowedEquipment.includes(eq));
        if (!hasAllowedEquipment) return false;
      } else {
        // User has specific equipment - match any of them
        const hasMatchingEquipment = !exercise.equipment || 
          exercise.equipment.length === 0 ||
          exercise.equipment.some((eq: any) => 
            input.equipment.includes(eq) || eq === "none"
          );
        if (!hasMatchingEquipment) return false;
      }
    }
    
    // Focus areas matching - now used for preference, not filtering
    // We'll store the match result for later sorting instead of filtering out
    // This allows exercises to pass through even if they don't match focus areas
    
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

  console.log("After filtering:", {
    found: recommendedExercises.length,
    totalAvailable: allExercises.length,
    goalType,
    experienceLevel,
    equipment: input?.equipment,
    focusAreas: input?.focusAreas
  });

  // Score exercises based on focus area match and other preferences
  const scoredExercises = recommendedExercises.map((exercise: any) => {
    let score = 0;
    
    // Focus area matching (muscle groups)
    if (input?.focusAreas && input.focusAreas.length > 0) {
      const matchingGroups = exercise.muscleGroups?.filter((mg: string) => 
        input.focusAreas.some((fa: string) => 
          mg.toLowerCase().includes(fa.toLowerCase()) || 
          fa.toLowerCase().includes(mg.toLowerCase())
        )
      );
      score += (matchingGroups?.length || 0) * 10;
    }
    
    // Duration preference matching
    if (input?.duration) {
      const durationDiff = Math.abs(exercise.duration - input.duration);
      score += Math.max(0, 10 - durationDiff / 5);
    }
    
    // Intensity matching (map to difficulty)
    if (input?.intensity) {
      const intensityMap = { low: "beginner", moderate: "intermediate", high: "advanced" };
      if (exercise.difficulty === intensityMap[input.intensity as keyof typeof intensityMap]) {
        score += 5;
      }
    }
    
    // Bonus for YouTube videos
    if (exercise.youtubeVideoId) {
      score += 3;
    }
    
    return { ...exercise, score };
  });

  // Sort by score (descending)
  scoredExercises.sort((a: any, b: any) => b.score - a.score);

  // Take top 16 candidates for variety
  const topCandidates = scoredExercises.slice(0, Math.min(16, scoredExercises.length));

  // Shuffle the top candidates to add variety
  const shuffled = topCandidates.sort(() => Math.random() - 0.5);

  console.log("Exercise scoring results:", {
    totalScored: scoredExercises.length,
    topScores: scoredExercises.slice(0, 5).map((e: any) => ({
      name: e.name,
      score: e.score,
      muscleGroups: e.muscleGroups,
      category: e.category
    })),
    focusAreas: input?.focusAreas,
    selectedExercises: shuffled.slice(0, 8).map((e: any) => ({
      name: e.name,
      score: e.score
    }))
  });

  // Return 6-8 exercises
  return shuffled.slice(0, 8);

  // If no exercises match, relax filters progressively
  if (recommendedExercises.length === 0) {
    console.log("No exercises found with strict filters, relaxing...");
    
    // Try without focus area filter
    recommendedExercises = allExercises.filter((exercise: any) => {
      if (exercise.difficulty === "advanced" && experienceLevel === "beginner") {
        return false;
      }
      
      // Apply goal type filter only
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
  }

  // If still no exercises, return any exercises matching difficulty
  if (recommendedExercises.length === 0) {
    console.log("Still no exercises, using difficulty-only filter...");
    recommendedExercises = allExercises.filter((exercise: any) => {
      if (exercise.difficulty === "advanced" && experienceLevel === "beginner") {
        return false;
      }
      return true;
    });
  }

  // Absolute fallback - return first 8 exercises
  if (recommendedExercises.length === 0) {
    console.log("No exercises found at all, using first 8 exercises");
    recommendedExercises = allExercises.slice(0, 8);
  }
  
  console.log("Final exercises:", {
    finalCount: recommendedExercises.length,
    exercises: recommendedExercises.map((e: any) => ({ id: e.id, name: e.name, category: e.category }))
  });
  
  // Apply scoring to fallback exercises as well
  const fallbackScoredExercises = recommendedExercises.map((exercise: any) => {
    let score = 0;
    
    // Focus area matching (muscle groups)
    if (input?.focusAreas && input.focusAreas.length > 0) {
      const matchingGroups = exercise.muscleGroups?.filter((mg: string) => 
        input.focusAreas.some((fa: string) => 
          mg.toLowerCase().includes(fa.toLowerCase()) || 
          fa.toLowerCase().includes(mg.toLowerCase())
        )
      );
      score += (matchingGroups?.length || 0) * 10;
    }
    
    // Duration preference matching
    if (input?.duration) {
      const durationDiff = Math.abs(exercise.duration - input.duration);
      score += Math.max(0, 10 - durationDiff / 5);
    }
    
    // Intensity matching (map to difficulty)
    if (input?.intensity) {
      const intensityMap = { low: "beginner", moderate: "intermediate", high: "advanced" };
      if (exercise.difficulty === intensityMap[input.intensity as keyof typeof intensityMap]) {
        score += 5;
      }
    }
    
    // Bonus for YouTube videos
    if (exercise.youtubeVideoId) {
      score += 3;
    }
    
    return { ...exercise, score };
  });

  // Sort by score (descending)
  fallbackScoredExercises.sort((a: any, b: any) => b.score - a.score);

  // Take top candidates and shuffle for variety
  const fallbackTopCandidates = fallbackScoredExercises.slice(0, Math.min(16, fallbackScoredExercises.length));
  const fallbackShuffled = fallbackTopCandidates.sort(() => Math.random() - 0.5);
  
  // Return top 6-8 exercises
  return fallbackShuffled.slice(0, 8);
}

// Helper function to create workout plan
function createWorkoutPlan(input: any, exercises: any[]) {
  // Use custom name if provided, otherwise generate smart default
  const planName = input.customPlanName || `${input.durationWeeks}-Week Plan`;
  
  const planExercises = exercises.map(exercise => {
    const baseExercise = {
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
      restSeconds: exercise.category === "strength" ? 60 : 30,
    };

    // Conditionally add reps for strength exercises
    if (exercise.category === "strength") {
      return { ...baseExercise, reps: 12 };
    }
    
    // Conditionally add duration for cardio exercises
    if (exercise.category === "cardio") {
      return { ...baseExercise, duration: 30 };
    }
    
    return baseExercise;
  });
  
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
    .input(z.object({ 
      sessionId: z.string(),
      goalUpdates: z.array(z.object({
        goalId: z.string(),
        progressValue: z.number().min(0),
      })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Complete the session
      await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutSessions`)
        .doc(input.sessionId)
        .update({
          completedAt: new Date(),
        });

      // Update goals if provided
      if (input.goalUpdates && input.goalUpdates.length > 0) {
        const batch = ctx.db.batch();
        
        for (const goalUpdate of input.goalUpdates) {
          const goalRef = ctx.db
            .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/goals`)
            .doc(goalUpdate.goalId);
          
          batch.update(goalRef, {
            currentValue: goalUpdate.progressValue,
            updatedAt: new Date(),
          });
        }
        
        await batch.commit();
      }

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

  // Update workout plan
  updatePlan: protectedProcedure
    .input(z.object({
      planId: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      durationWeeks: z.number().min(1).max(52).optional(),
      workoutsPerWeek: z.number().min(1).max(7).optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const updateData: any = { updatedAt: new Date() };
      if (input.name) updateData.name = input.name;
      if (input.description) updateData.description = input.description;
      if (input.durationWeeks) updateData.durationWeeks = input.durationWeeks;
      if (input.workoutsPerWeek) updateData.workoutsPerWeek = input.workoutsPerWeek;
      if (input.difficulty) updateData.difficulty = input.difficulty;

      await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutPlans`)
        .doc(input.planId)
        .update(updateData);

      return { success: true };
    }),

  // Delete workout plan
  deletePlan: protectedProcedure
    .input(z.object({ planId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Delete the workout plan
      await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutPlans`)
        .doc(input.planId)
        .delete();

      // Also delete associated workout sessions
      const sessionsSnapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/workoutSessions`)
        .where('planId', '==', input.planId)
        .get();

      const batch = ctx.db.batch();
      sessionsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      return { success: true };
    }),
});
