import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

const PROJECT_ID = "fit-league-930c6";

// Video search and filtering schemas
const VideoSearchSchema = z.object({
  query: z.string().optional(),
  category: z.array(z.string()).optional(),
  difficulty: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  duration: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
});

const PlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  isPublic: z.boolean().default(false),
  videos: z.array(z.string()), // Exercise IDs
});

const VideoAnalyticsSchema = z.object({
  videoId: z.string(),
  watchTime: z.number().min(0), // in minutes
  completionRate: z.number().min(0).max(100), // percentage
  lastWatched: z.date(),
});

export const videosRouter = router({
  // Search videos with filters
  searchVideos: protectedProcedure
    .input(VideoSearchSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        // Get exercises from the public exercises collection
        const exercisesRef = ctx.db.collection(`artifacts/${PROJECT_ID}/public/data/exercises`);
        let query = exercisesRef.limit(input.limit).offset(input.offset);

        // Apply filters
        if (input.category && input.category.length > 0) {
          query = query.where("category", "in", input.category);
        }

        if (input.difficulty && input.difficulty.length > 0) {
          query = query.where("difficulty", "in", input.difficulty);
        }

        if (input.equipment && input.equipment.length > 0) {
          query = query.where("equipment", "array-contains-any", input.equipment);
        }

        if (input.duration) {
          query = query
            .where("duration", ">=", input.duration.min)
            .where("duration", "<=", input.duration.max);
        }

        const snapshot = await query.get();
        const exercises = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter by search query if provided
        let filteredExercises = exercises;
        if (input.query) {
          const searchTerm = input.query.toLowerCase();
          filteredExercises = exercises.filter(exercise =>
            exercise.name.toLowerCase().includes(searchTerm) ||
            exercise.description.toLowerCase().includes(searchTerm) ||
            exercise.muscleGroups.some((group: string) => group.toLowerCase().includes(searchTerm))
          );
        }

        return {
          exercises: filteredExercises,
          total: filteredExercises.length,
          hasMore: filteredExercises.length === input.limit,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search videos",
        });
      }
    }),

  // Get user's playlists
  getUserPlaylists: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const playlistsRef = ctx.db.collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/playlists`);
        const snapshot = await playlistsRef.orderBy("createdAt", "desc").get();
        
        const playlists = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }));

        return playlists;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch playlists",
        });
      }
    }),

  // Create new playlist
  createPlaylist: protectedProcedure
    .input(PlaylistSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const playlistRef = ctx.db.collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/playlists`);
        
        // Get video details for duration calculation
        const exercisesRef = ctx.db.collection(`artifacts/${PROJECT_ID}/public/data/exercises`);
        const videoPromises = input.videos.map(videoId => 
          exercisesRef.doc(videoId).get()
        );
        const videoSnapshots = await Promise.all(videoPromises);
        const videos = videoSnapshots
          .filter(snapshot => snapshot.exists)
          .map(snapshot => ({ id: snapshot.id, ...snapshot.data() }));

        const totalDuration = videos.reduce((sum, video) => sum + (video.duration || 0), 0);
        const difficulties = [...new Set(videos.map(v => v.difficulty))];
        const categories = [...new Set(videos.map(v => v.category))];

        const playlistData = {
          ...input,
          createdBy: ctx.auth.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalDuration,
          difficulty: difficulties.length === 1 ? difficulties[0] : "mixed",
          category: categories.length === 1 ? categories[0] : "mixed",
          videoCount: videos.length,
        };

        const docRef = await playlistRef.add(playlistData);

        return {
          id: docRef.id,
          ...playlistData,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create playlist",
        });
      }
    }),

  // Update playlist
  updatePlaylist: protectedProcedure
    .input(z.object({
      playlistId: z.string(),
      updates: PlaylistSchema.partial(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const playlistRef = ctx.db.collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/playlists`);
        const playlistDoc = await playlistRef.doc(input.playlistId).get();

        if (!playlistDoc.exists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Playlist not found",
          });
        }

        const updateData = {
          ...input.updates,
          updatedAt: new Date(),
        };

        // Recalculate duration if videos were updated
        if (input.updates.videos) {
          const exercisesRef = ctx.db.collection(`artifacts/${PROJECT_ID}/public/data/exercises`);
          const videoPromises = input.updates.videos.map(videoId => 
            exercisesRef.doc(videoId).get()
          );
          const videoSnapshots = await Promise.all(videoPromises);
          const videos = videoSnapshots
            .filter(snapshot => snapshot.exists)
            .map(snapshot => ({ id: snapshot.id, ...snapshot.data() }));

          updateData.totalDuration = videos.reduce((sum, video) => sum + (video.duration || 0), 0);
          updateData.videoCount = videos.length;
        }

        await playlistRef.doc(input.playlistId).update(updateData);

        return {
          success: true,
          message: "Playlist updated successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update playlist",
        });
      }
    }),

  // Delete playlist
  deletePlaylist: protectedProcedure
    .input(z.object({ playlistId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const playlistRef = ctx.db.collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/playlists`);
        await playlistRef.doc(input.playlistId).delete();

        return {
          success: true,
          message: "Playlist deleted successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete playlist",
        });
      }
    }),

  // Track video analytics
  trackVideo: protectedProcedure
    .input(VideoAnalyticsSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const analyticsRef = ctx.db.collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/videoAnalytics`);
        
        // Check if analytics record exists for this video
        const existingDoc = await analyticsRef.where("videoId", "==", input.videoId).limit(1).get();
        
        if (existingDoc.empty) {
          // Create new analytics record
          await analyticsRef.add({
            ...input,
            userId: ctx.auth.uid,
            totalViews: 1,
            averageWatchTime: input.watchTime,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          // Update existing record
          const doc = existingDoc.docs[0];
          const existingData = doc.data();
          const newTotalViews = existingData.totalViews + 1;
          const newAverageWatchTime = (existingData.averageWatchTime + input.watchTime) / 2;

          await doc.ref.update({
            watchTime: input.watchTime,
            completionRate: input.completionRate,
            lastWatched: input.lastWatched,
            totalViews: newTotalViews,
            averageWatchTime: newAverageWatchTime,
            updatedAt: new Date(),
          });
        }

        return {
          success: true,
          message: "Video analytics tracked successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to track video analytics",
        });
      }
    }),

  // Get user video analytics
  getUserAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const analyticsRef = ctx.db.collection(`artifacts/${PROJECT_ID}/users/${ctx.auth.uid}/videoAnalytics`);
        const snapshot = await analyticsRef.orderBy("lastWatched", "desc").get();
        
        const analytics = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastWatched: doc.data().lastWatched?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        }));

        // Calculate user stats
        const totalWatchTime = analytics.reduce((sum, record) => sum + record.watchTime, 0);
        const totalVideosWatched = analytics.length;
        const averageCompletionRate = analytics.length > 0 
          ? analytics.reduce((sum, record) => sum + record.completionRate, 0) / analytics.length 
          : 0;

        // Get favorite category (most watched)
        const categoryCounts: Record<string, number> = {};
        analytics.forEach(record => {
          // This would need to be enhanced to get category from video data
          categoryCounts["cardio"] = (categoryCounts["cardio"] || 0) + 1;
        });
        const favoriteCategory = Object.keys(categoryCounts).reduce((a, b) => 
          categoryCounts[a] > categoryCounts[b] ? a : b, "cardio"
        );

        return {
          totalWatchTime,
          totalVideosWatched,
          averageCompletionRate,
          favoriteCategory,
          weeklyGoal: 300, // 5 hours per week
          weeklyProgress: Math.min(totalWatchTime, 300),
          streak: 7, // This would need to be calculated from actual data
          achievements: [], // This would be populated from achievements system
          recentVideos: analytics.slice(0, 10),
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user analytics",
        });
      }
    }),
});
