import { useState } from 'react'
import { GroupedHistory } from '@/types/history';
import { Box, Button, IconButton, List, ListItemButton, TextField, Typography } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { CONSTANTS } from '@/constants/text';

interface SidebarNavProps {
    handleNewChat: () => void
    groupedHistory: GroupedHistory[]
    onSelect: (id: string) => void
    selectedId: string | null
    onSearch: (query: string) => void
    onEditTitle: (id: string, newTitle: string) => void
    onDeleteChat: (id: string) => void
}
export default function SidebarNav({ handleNewChat, groupedHistory, onSelect, selectedId, onSearch, onEditTitle, onDeleteChat }: SidebarNavProps) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [menuId, setMenuId] = useState<string | null>(null)

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, id: string) => {
        e.stopPropagation()
        setMenuId(id)
        setAnchorEl(e.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setMenuId(null)
    }

    return (
        <Box
            sx={{
                width: '20%',
                minWidth: '200px',
                flexShrink: 0,
                bgcolor: 'black',
                height: '100%',
                overflowY: 'auto',
                p: 2
            }}
        >
            {/* New Chat Button */}
            <Button
                variant="contained"
                fullWidth
                sx={{
                    bgcolor: 'white',
                    color: 'black',
                    borderRadius: '16px',
                    mb: 2,
                    fontWeight: 500,
                    '&:hover': {
                        bgcolor: '#5d6ef0',
                    },
                }}
                onClick={handleNewChat}
            >
                <Typography variant="button" sx={{ fontWeight: 600 }}>
                    {CONSTANTS.BUTTONS.NEWCHAT}
                </Typography>
            </Button>

            {/* Search Bar */}
            <TextField
                placeholder="Search"
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                    mb: 2,
                    input: {
                        bgcolor: '#121212',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '16px',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#333',
                            borderRadius: '16px',
                        },
                        '&:hover fieldset': {
                            borderColor: 'white',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white',
                        },
                    },
                }}
                onChange={(e) => onSearch(e.target.value)}
            />
            {/* Chat History */}
            <List>
                {groupedHistory.map((group) => (
                    <Box key={group.label} sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                            {group.label}
                        </Typography>
                        <List disablePadding>
                            {group.items.map(({ id, title }) =>
                                editingId === id ? (
                                    <Box
                                        key={id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderRadius: 2,
                                            px: 1.5,
                                        }}
                                    >
                                        <TextField
                                            defaultValue={title}
                                            size="small"
                                            autoFocus
                                            onBlur={(e) => {
                                                onEditTitle(id, e.target.value.trim());
                                                setEditingId(null);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    onEditTitle(id, (e.target as HTMLInputElement).value.trim());
                                                    setEditingId(null);
                                                } else if (e.key === 'Escape') {
                                                    setEditingId(null);
                                                }
                                            }}
                                            slotProps={{
                                                input: {
                                                    style: {
                                                        fontSize: '0.9rem',
                                                        padding: '6px',
                                                        color: 'white',
                                                        backgroundColor: '#121212',
                                                        borderRadius: 3,
                                                    },
                                                },
                                            }}
                                            fullWidth
                                        />
                                    </Box>
                                ) : (
                                    <ListItemButton
                                        key={id}
                                        selected={id === selectedId}
                                        onClick={() => {
                                            onSelect(id);
                                        }}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderRadius: 2,
                                            '&.Mui-selected': {
                                                bgcolor: '#1e1e1e',
                                            },
                                            '&:hover': {
                                                bgcolor: '#161b22',
                                            },
                                            px: 1.5,
                                            py: 0.75,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'white',
                                                fontSize: '0.9rem',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {title}
                                        </Typography>

                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, id)}
                                            sx={{
                                                color: '#888',
                                                ml: 1,
                                                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                                            }}
                                        >
                                            <MoreHorizIcon fontSize="small" />
                                        </IconButton>
                                    </ListItemButton>
                                )
                            )}
                        </List>
                    </Box>
                ))}
            </List>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    onClick={() => {
                        handleMenuClose()
                        if (menuId) {
                            setEditingId(menuId)
                        }
                    }}
                >
                    <Typography variant='body2'>
                        {CONSTANTS.BUTTONS.EDIT}
                    </Typography>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleMenuClose()
                        if (menuId) {
                            onDeleteChat(menuId)
                        }
                    }}
                >
                    <Typography variant='body2'>
                        {CONSTANTS.BUTTONS.DELETE}
                    </Typography>
                </MenuItem>
            </Menu>

        </Box>
    )
}
