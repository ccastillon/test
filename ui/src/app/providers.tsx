"use client";

import { SessionProvider } from "next-auth/react";
import UseAuth from "./useAuth";
import { getQueryClient } from "./get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <SessionProvider>
      {/* <UseAuth>{children}</UseAuth> */}
      <UseAuth>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </UseAuth>
    </SessionProvider>
  );
}
