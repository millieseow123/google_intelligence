import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme/theme' // adjust the path if needed
import type { AppProps } from 'next/app'
import '@/app/globals.css' // if you have global styles

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}
