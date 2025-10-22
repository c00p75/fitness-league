import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { auth } from "../context";
import { z } from "zod";

export const authRouter = router({
  // Get current user info
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth?.uid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const userRecord = await auth.getUser(ctx.auth.uid);
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
        photoURL: userRecord.photoURL,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user information",
      });
    }
  }),

  // Create user profile after signup
  createUserProfile: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
        
        // Check if profile already exists
        const existingProfile = await userRef.doc("main").get();
        if (existingProfile.exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User profile already exists",
          });
        }

        // Create initial profile
        const profileData = {
          uid: ctx.auth.uid,
          email: (input as any).email,
          displayName: "",
          avatarUrl: null,
          biometrics: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await userRef.doc("main").set(profileData);

        return {
          success: true,
          message: "User profile created successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user profile",
        });
      }
    }),

  // Delete user account
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.auth?.uid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      // Delete user data from Firestore
      const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}`);
      const userDocs = await userRef.listDocuments();
      
      // Delete all subcollections
      for (const doc of userDocs) {
        const subcollections = await doc.listCollections();
        for (const subcol of subcollections) {
          const subdocs = await subcol.listDocuments();
          for (const subdoc of subdocs) {
            await subdoc.delete();
          }
        }
        await doc.delete();
      }

      // Delete user from Firebase Auth
      await auth.deleteUser(ctx.auth.uid);

      return {
        success: true,
        message: "Account deleted successfully",
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete account",
      });
    }
  }),
});
