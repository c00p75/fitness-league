import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../api";
import { createContext } from "../../../api/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: ({ req }) => createContext({ req }),
  });

export { handler as GET, handler as POST };
