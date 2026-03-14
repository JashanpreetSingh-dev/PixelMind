"use client";

import { InstallPromptProvider } from "@/lib/install-prompt";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <InstallPromptProvider>{children}</InstallPromptProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
