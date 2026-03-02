"use client";

import { AuthProvider } from "@/lib/auth-context";
import { QueryProvider } from "@/lib/providers/query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
          {children}
      </AuthProvider>
    </QueryProvider>
  );
}
