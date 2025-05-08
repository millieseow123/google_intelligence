import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme/theme'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import '@/app/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </SessionProvider>

    )
}
