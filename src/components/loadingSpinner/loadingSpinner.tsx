'use client'

import { Box, CircularProgress } from '@mui/material'

export default function LoadingSpinner() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                minHeight: '150px',
            }}
        >
            <CircularProgress sx={{
                color: 'white',
            }} />
        </Box>
    )
}
