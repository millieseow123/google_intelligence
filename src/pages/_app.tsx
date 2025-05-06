import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/theme/theme' 
import type { AppProps } from 'next/app'
import '@/app/globals.css' 

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    )
}
