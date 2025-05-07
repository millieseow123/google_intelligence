import React from 'react'
import { IconButton, IconButtonProps } from '@mui/material'

interface RoundIconButtonProps extends IconButtonProps {
    icon: React.ReactNode
}

export default function RoundIconButton({ icon, sx, ...rest }: RoundIconButtonProps) {
    return (
        <IconButton
            size="small"
            sx={{
                bgcolor: '#2e2e2e',
                color: 'white',
                border: '1px solid #555',
                '&:hover': {
                    bgcolor: '#444',
                },
                ...sx,
            }}
            {...rest}
        >
            {icon}
        </IconButton>
    )
}
