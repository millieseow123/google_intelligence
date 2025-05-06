import { Box, Paper } from '@mui/material'
import { renderSlateContent } from '@/utils/renderSlateContent'
import FilePreview from '../filePreview/filePreview'

export interface ChatMessage {
    text: any[]
    file: File | null
}

interface ChatHistoryProps {
    messages: ChatMessage[]
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
    if (messages.length === 0) return null

    return (
        <Paper
            elevation={3}
            sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2,
                borderRadius: 3,
                bgcolor: 'black',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: 2,
            }}
        >
            {messages.slice().reverse().map((msg, idx) => (
                <Box
                    key={idx}
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            px: 2,
                            py: 1,
                            bgcolor: '#ffffff',
                            borderRadius: 2,
                            boxShadow: 1,
                            maxWidth: '80%',
                            wordBreak: 'break-word',
                        }}
                    >
                        {msg.file && (
                            <Box mb={1}>
                                <FilePreview file={msg.file} showRemove={false} />
                            </Box>
                        )}
                        {renderSlateContent(msg.text)}
                    </Box>
                </Box>
            ))}
        </Paper>
    )
}
