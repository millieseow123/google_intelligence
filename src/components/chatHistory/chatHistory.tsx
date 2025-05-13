import { Box, Paper } from '@mui/material'
import { renderSlateContent } from '@/utils/renderSlateContent'
import FilePreview from '../filePreview/filePreview'
import { ChatMessage, Sender } from '@/types/chat'

interface ChatHistoryProps {
    messages: ChatMessage[]
    scrollRef?: React.RefObject<HTMLDivElement | null>
}

export default function ChatHistory({ messages, scrollRef }: ChatHistoryProps) {
    if (messages.length === 0) return null

    return (
        <Paper
            ref={scrollRef}
            sx={{
                flexGrow: 1,
                overflowY: 'auto',
                minHeight: 0,
                bgcolor: 'black',
                p: 2,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {messages.slice().map((msg, idx) => (
                <Box
                    key={idx}
                    sx={{
                        display: 'flex',
                        justifyContent: msg.sender === Sender.USER ? 'flex-end' : 'flex-start',
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: 1,
                            maxWidth: '80%',
                            wordBreak: 'break-word',
                            bgcolor: msg.sender === Sender.USER ? '#fff' : '#2e2e2e',
                            color: msg.sender === Sender.USER ? 'black' : 'white',
                        }}
                    >
                        {msg.file && (
                            <Box>
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
