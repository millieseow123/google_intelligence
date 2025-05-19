"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import client from "@/lib/apolloClient";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/theme/theme";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
