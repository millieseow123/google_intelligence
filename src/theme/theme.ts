import { createTheme } from '@mui/material/styles'

const theme = createTheme({
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
