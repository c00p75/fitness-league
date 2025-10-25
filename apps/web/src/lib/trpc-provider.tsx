import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { trpc, trpcClient } from "./trpc";

interface TRPCProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export function TRPCProvider({ children, queryClient }: TRPCProviderProps) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}
