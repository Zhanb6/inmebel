/*
 * Copyright (c) 2025. Sayat Raykul
 */

"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./ThemeProvider";
import { I18nextProvider } from "react-i18next";
import { defaultNS, i18n } from "@/i18n";
import { NavigationProvider } from "./NavigationProvider";
import { SessionProvider } from "next-auth/react";
import { SessionManager } from "../components/SessionManager";

export function ClientProvidersWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <I18nextProvider i18n={i18n} defaultNS={defaultNS}>
      <ThemeProvider>
        <SessionProvider>
          <SessionManager />
          <QueryClientProvider client={queryClient}>
            <NavigationProvider>{children}</NavigationProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SessionProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
