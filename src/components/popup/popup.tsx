import { Popover, Box } from '@mui/material'
import React from 'react'

interface PopupProps {
    anchorEl: HTMLElement | null
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function Popup({ anchorEl, open, onClose, children }: PopupProps) {
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
            <Box sx={{ p: 1, borderRadius: '16px', minWidth: 200 }}>
                {children}
            </Box>
        </Popover>
    )
}
