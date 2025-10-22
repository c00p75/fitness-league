import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { UserProfileSchema, UpdateProfileSchema } from "@fitness-league/shared";

export const userRouter = router({
  // Get user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth?.uid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
      const profileDoc = await userRef.doc("main").get();

      if (!profileDoc.exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User profile not found",
        });
      }

      const profileData = profileDoc.data();
      return UserProfileSchema.parse(profileData);
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user profile",
      });
    }
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(UpdateProfileSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
        const profileDoc = await userRef.doc("main").get();

        if (!profileDoc.exists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        const updateData = {
          ...input,
          updatedAt: new Date(),
        };

        await userRef.doc("main").update(updateData);

        return {
          success: true,
          message: "Profile updated successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    }),

  // Upload avatar
  uploadAvatar: protectedProcedure
    .input(require("zod").z.object({
      imageData: require("zod").z.string(), // base64 encoded image
      contentType: require("zod").z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth?.uid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        // Convert base64 to buffer
        const base64Data = (input as any).imageData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        // Upload to Firebase Storage
        const bucket = ctx.storage.bucket();
        const fileName = `avatars/${ctx.auth.uid}/${Date.now()}.${(input as any).contentType.split("/")[1]}`;
        const file = bucket.file(fileName);

        await file.save(buffer, {
          metadata: {
            contentType: (input as any).contentType,
          },
        });

        // Make file publicly accessible
        await file.makePublic();

        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Update user profile with new avatar URL
        const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
        await userRef.doc("main").update({
          avatarUrl: publicUrl,
          updatedAt: new Date(),
        });

        return {
          success: true,
          avatarUrl: publicUrl,
          message: "Avatar uploaded successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload avatar",
        });
      }
    }),

  // Delete avatar
  deleteAvatar: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.auth?.uid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const userRef = ctx.db.collection(`artifacts/fit-league-930c6/users/${ctx.auth.uid}/profile`);
      await userRef.doc("main").update({
        avatarUrl: null,
        updatedAt: new Date(),
      });

      return {
        success: true,
        message: "Avatar deleted successfully",
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete avatar",
      });
    }
  }),
});
