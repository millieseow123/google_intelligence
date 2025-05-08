'use client'

import { useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import Image from 'next/image'

interface ProfileMenuProps {
    imageUrl: string
    onSignOutStart?: () => void
}

export default function ProfileMenu({ imageUrl, onSignOutStart }: ProfileMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleSignOut = () => {
        if (onSignOutStart) onSignOutStart()
        handleClose()
    }

    return (
        <div>
            <Image
                src={imageUrl}
                alt="Profile"
                width={32}
                height={32}
                style={{ borderRadius: '50%' }}
                onMouseEnter={handleOpen}
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onMouseLeave={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </Menu>
        </div >
    )
}
