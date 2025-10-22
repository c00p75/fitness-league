import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";

// Import the AppRouter type from the API
import type { AppRouter } from "../api";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc", // Local API endpoint
      headers() {
        const token = localStorage.getItem("firebase-auth-token");
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});