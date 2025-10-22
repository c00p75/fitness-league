import { initTRPC, TRPCError } from "@trpc/server";
import { Context, AuthenticatedContext } from "./context";

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.code === "BAD_REQUEST" && error.cause instanceof Error 
          ? error.cause 
          : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth?.uid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth, // Now guaranteed to be defined
    } as AuthenticatedContext,
  });
});

// Admin procedure for admin-only operations
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth?.uid) {
    throw new TRPCError({
      code: "UNAUTHORIZED", 
      message: "You must be logged in to access this resource",
    });
  }
  
  // TODO: Add admin role check when user roles are implemented
  // For now, just require authentication
  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  });
});
