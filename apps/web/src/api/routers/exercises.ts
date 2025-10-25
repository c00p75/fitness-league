import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

// Define schemas locally to avoid import issues
const ExerciseSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  equipment: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
});

const PROJECT_ID = "fit-league-930c6";

export const exercisesRouter = router({
  // Search exercises
  searchExercises: publicProcedure
    .input(ExerciseSearchSchema)
    .query(async ({ ctx, input }) => {
      let query = ctx.db.collection(`artifacts/${PROJECT_ID}/public/data/exercises`);
      
      // Apply Firestore filters
      if (input.category) {
        query = query.where('category', '==', input.category) as any;
      }
      if (input.difficulty) {
        query = query.where('difficulty', '==', input.difficulty) as any;
      }
      
      const snapshot = await query.get();
      let exercises = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return { 
          id: doc.id, 
          ...data 
        };
      });
      
      // Client-side filtering for search query and equipment
      if (input.query) {
        const searchTerm = input.query.toLowerCase();
        exercises = exercises.filter((ex: any) => 
          ex.name?.toLowerCase().includes(searchTerm) ||
          ex.description?.toLowerCase().includes(searchTerm) ||
          ex.instructions?.some((instruction: string) => 
            instruction.toLowerCase().includes(searchTerm)
          )
        );
      }
      
      if (input.equipment) {
        exercises = exercises.filter((ex: any) => 
          ex.equipment?.includes(input.equipment)
        );
      }
      
      return exercises;
    }),

  // Get exercise details
  getExercise: publicProcedure
    .input(z.object({ exerciseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const doc = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
        .doc(input.exerciseId)
        .get();
      
      if (!doc.exists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exercise not found" });
      }
      
      return { id: doc.id, ...doc.data() as any };
    }),

  // Get exercises by category
  getExercisesByCategory: publicProcedure
    .input(z.object({ 
      category: z.string(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const snapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
        .where('category', '==', input.category)
        .limit(input.limit)
        .get();
      
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() as any
      }));
    }),

  // Get exercises by difficulty
  getExercisesByDifficulty: publicProcedure
    .input(z.object({ 
      difficulty: z.string(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const snapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
        .where('difficulty', '==', input.difficulty)
        .limit(input.limit)
        .get();
      
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() as any
      }));
    }),

  // Get all categories
  getCategories: publicProcedure
    .query(async ({ ctx }) => {
      const snapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
        .get();
      
      const categories = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.category) {
          categories.add(data.category);
        }
      });
      
      return Array.from(categories).sort();
    }),

  // Get all equipment types
  getEquipment: publicProcedure
    .query(async ({ ctx }) => {
      const snapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
        .get();
      
      const equipment = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.equipment && Array.isArray(data.equipment)) {
          data.equipment.forEach((item: string) => equipment.add(item));
        }
      });
      
      return Array.from(equipment).sort();
    }),

  // Get all muscle groups
  getMuscleGroups: publicProcedure
    .query(async ({ ctx }) => {
      const snapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
        .get();
      
      const muscleGroups = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.muscleGroups && Array.isArray(data.muscleGroups)) {
          data.muscleGroups.forEach((group: string) => muscleGroups.add(group));
        }
      });
      
      return Array.from(muscleGroups).sort();
    }),

  // Get featured exercises (for dashboard)
  getFeaturedExercises: publicProcedure
    .input(z.object({ 
      limit: z.number().min(1).max(20).default(6),
    }))
    .query(async ({ ctx, input }) => {
      const snapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
        .where('difficulty', '==', 'beginner')
        .limit(input.limit)
        .get();
      
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() as any
      }));
    }),

  // Get exercises with YouTube videos
  getExercisesWithVideos: publicProcedure
    .input(z.object({ 
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const snapshot = await ctx.db
        .collection(`artifacts/${PROJECT_ID}/public/data/exercises`)
        .get();
      
      const exercises = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() as any }))
        .filter((ex: any) => ex.youtubeVideoId)
        .slice(0, input.limit);
      
      return exercises;
    }),
});
