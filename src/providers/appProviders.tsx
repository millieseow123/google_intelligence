"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ChatContextProvider } from "@/context/ChatContext";
import client from "@/lib/apolloClient";
import theme from "@/theme/theme";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider>
        <ChatContextProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ChatContextProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
