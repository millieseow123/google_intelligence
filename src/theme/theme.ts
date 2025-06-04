import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    height: '100%',
                },
                body: {
                    height: '100%',
                    margin: 0,
                },
                '#__next': {
                    height: '100%',
                },
            },
        },
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#1e1e1e'
        },
        secondary: {
            main: '#9c27b0'
        }
    },
    shape: {
        borderRadius: 12
    }
})

export default theme
