import { Box, Paper, Typography, IconButton, Avatar, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

interface FilePreviewProps {
    file: File
    onRemove?: () => void
    showRemove?: boolean;
}

export default function FilePreview({ file, onRemove, showRemove = true }: FilePreviewProps) {
    const getFileTypeLabel = (file: File) => {
        if (!file) return 'File'
        const type = file.type

        if (type.startsWith('image/')) return 'Image'
        if (type.startsWith('video/')) return 'Video'
        if (type === 'application/pdf') return 'PDF'

        return 'File'
    }

    return (
        <Paper
            elevation={3}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#1e1e1e',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2,
                width: 'fit-content',
                mb: 1
            }}
        >
            <Avatar sx={{ bgcolor: '#5DADE2', width: 36, height: 36 }}>
                <InsertDriveFileIcon fontSize="small" />
            </Avatar>
            <Box>
                <Typography fontSize={14} fontWeight="bold">
                    {file.name}
                </Typography>
                <Typography fontSize={12} color="gray">
                    {getFileTypeLabel(file)}
                </Typography>
            </Box>
            {showRemove && (
                <Tooltip title="Remove file">
                    <IconButton onClick={onRemove}
                        sx={{
                            p: 0,
                            pl: 1
                        }}>
                        <CloseIcon fontSize="small" sx={{ color: 'white' }} />
                    </IconButton>
                </Tooltip>
            )}
        </Paper>
    )
}
