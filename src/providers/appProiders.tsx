"use client"

import { ReactNode } from "react"
import { ApolloProvider } from "@apollo/client"
import { SessionProvider } from "next-auth/react"
import client from "@/lib/apolloClient"

export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ApolloProvider client={client}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </ApolloProvider>
    )
}
